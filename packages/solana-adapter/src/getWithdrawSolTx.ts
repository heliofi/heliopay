import { SystemProgram } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getWithdrawSolTx = async (
  program: Program<HelioIdl>,
  req: WithdrawRequest
): Promise<string> => {
  const transaction = await program.methods
    .withdrawSol()
    .accounts({
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return JSON.stringify(transaction);
};
