import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { SinglePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

const prepareSplitPaymentsValues = (
  amounts: Array<string> = [],
  accounts: Array<PublicKey> = []
): { remainingAmounts: Array<BN>; remainingAccounts: Array<AccountMeta> } => {
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

export const getSinglePaymentTx = async (
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  fee: number = 0,
  amounts: Array<string> = [],
  accounts: Array<PublicKey> = []
): Promise<Transaction> => {
  const { mintAddress, tokenProgram } = req;

  const senderAssociatedTokenAddress = await getAssociatedTokenAddress(
    mintAddress,
    req.sender,
    true,
    tokenProgram
  );

  const recipientAssociatedTokenAddress = await getAssociatedTokenAddress(
    mintAddress,
    req.recipient,
    true,
    tokenProgram
  );

  const helioFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mintAddress,
    helioFeeWalletKey,
    false,
    tokenProgram
  );

  const daoFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mintAddress,
    daoFeeWalletKey,
    false,
    tokenProgram
  );

  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
  );

  const transaction = await program.methods
    .singlePayment(new BN(req.amount), new BN(fee), remainingAmounts)
    .accounts({
      sender: req.sender,
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount: helioFeeTokenAccountAddress,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount: daoFeeTokenAccountAddress,
      mint: mintAddress,
      tokenProgram,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .remainingAccounts(remainingAccounts)
    .transaction();

  return transaction;
};
