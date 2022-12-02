import { SystemProgram, Transaction } from '@solana/web3.js';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getWithdrawSolTx = async (
  program: Program<HelioIdl>,
  req: WithdrawRequest,
  fee: number = 0
): Promise<Transaction> => {
  const transaction = await program.methods
    .withdrawSol(new BN(fee))
    .accounts({
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
