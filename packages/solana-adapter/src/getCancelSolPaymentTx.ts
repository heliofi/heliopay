import { SystemProgram, Transaction } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getCancelSolPaymentTx = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest
): Promise<Transaction> => {
  const transaction = await program.methods
    .cancelSolPayment()
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
