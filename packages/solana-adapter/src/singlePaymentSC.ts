import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { Account, SinglePaymentRequest } from './types';
import './config';

const prepareSplitPaymentsValues = (
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): { remainingAmounts: Array<BN>; remainingAccounts: Array<Account> } => {
  if (!amounts.length) {
    if (accounts.length > 0) {
      throw new Error('Remaining accounts when no amounts!');
    }
  } else if (2 * amounts.length !== accounts.length) {
    throw new Error('Remaining accounts not matching amounts!');
  }

  const remainingAmounts = [];
  const remainingAccounts = [];

  for (let i = 0; i < amounts.length; i++) {
    remainingAmounts.push(new BN(amounts[i]));
    remainingAccounts.push({
      pubkey: accounts[2 * i],
      isWritable: false,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: accounts[2 * i + 1],
      isWritable: true,
      isSigner: false,
    });
  }

  return { remainingAmounts, remainingAccounts };
};

export const singlePaymentSC = async (
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): Promise<string> => {
  const mint = req.mintAddress;

  const senderAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.sender
  );

  const recipientAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.recipient
  );

  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
  );

  return program.rpc.singlePayment(new BN(req.amount), remainingAmounts, {
    accounts: {
      sender: req.sender,
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      mint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
    remainingAccounts,
  });
};
