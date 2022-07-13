import { SystemProgram } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import './config';

export const cancelSolPayment = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest
): Promise<string> =>
  program.rpc.cancelSolPayment({
    accounts: {
      signer: req.sender,
      sender: req.sender,
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      systemProgram: SystemProgram.programId,
    },
  });
