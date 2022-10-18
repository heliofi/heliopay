import { SystemProgram } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const withdrawSol = async (
  program: Program<HelioIdl>,
  req: WithdrawRequest
): Promise<string> =>
  program.rpc.withdrawSol({
    accounts: {
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    },
  });
