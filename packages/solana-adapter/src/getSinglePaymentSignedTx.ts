import {
  AccountMeta,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { SinglePaymentRequest } from './types';
import './config';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getSinglePaymentSignedTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  payFees: boolean = true,
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): Promise<string> => {
  const mint = req.mintAddress;

  const senderAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.sender
  );

  const recipientAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const helioFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    daoFeeWalletKey
  );

  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
  );

  const transaction = await program.methods
    .singlePayment(new BN(req.amount), payFees, remainingAmounts)
    .accounts({
      sender: req.sender,
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      mint,
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount: helioFeeTokenAccountAddress,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount: daoFeeTokenAccountAddress,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .remainingAccounts(remainingAccounts)
    .transaction();

  return signTransaction(transaction, wallet, connection);
};

const prepareSplitPaymentsValues = (
  amounts: Array<number> = [],
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
