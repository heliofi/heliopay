import { SystemProgram, Transaction } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { CreatePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getCreateSolPaymentTx = async (
  program: Program<HelioIdl>,
  req: CreatePaymentRequest,
  payFees: boolean = true
): Promise<Transaction> => {
  const transaction = await program.methods
    .createSolPayment(
      new BN(req.amount),
      new BN(req.startAt),
      new BN(req.endAt),
      new BN(req.interval),
      payFees
    )
    .accounts({
      sender: req.sender,
      recipient: req.recipient,
      solPaymentAccount: req.paymentAccount,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
