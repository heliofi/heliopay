import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
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
  }
  if (accounts.length !== amounts.length) {
    throw new Error('Remaining accounts not matching amounts!');
  }

  const remainingAmounts = [];
  const remainingAccounts = [];

  for (let i = 0; i < amounts.length; i++) {
    remainingAmounts.push(new BN(amounts[i]));
    remainingAccounts.push({
      pubkey: accounts[i],
      isWritable: true,
      isSigner: false,
    });
  }
  return { remainingAmounts, remainingAccounts };
};

export const getSingleSolPaymentTx = async (
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  fee: number = 0,
  amounts: Array<string> = [],
  accounts: Array<PublicKey> = []
): Promise<Transaction> => {
  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
  );

  const transaction = await program.methods
    .singleSolPayment(new BN(req.amount), new BN(fee), remainingAmounts)
    .accounts({
      sender: req.sender,
      recipient: req.recipient,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .remainingAccounts(remainingAccounts)
    .transaction();

  return transaction;
};
