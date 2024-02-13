import { SystemProgram, Transaction } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getCancelSolPaymentTx = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest,
  fee: number = 0
): Promise<Transaction> => {
  const transaction = await program.methods
    .cancelSolPayment(new BN(fee))
    .accounts({
      signer: req.sender,
      sender: req.sender,
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
