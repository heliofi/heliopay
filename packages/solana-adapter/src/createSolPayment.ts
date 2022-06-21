import { SystemProgram } from '@solana/web3.js';

import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';
import './config';

export const createSolPayment = async (
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest
): Promise<string> => {
  const startAt = Math.floor(req.startAt.getTime() / 1000) + 1;
  const endAt = Math.floor(req.endAt.getTime() / 1000) + 1;

  return program.rpc.createSolPayment(
    new BN(req.amount),
    new BN(startAt),
    new BN(endAt),
    new BN(req.interval),
    {
      accounts: {
        sender: req.sender,
        recipient: req.recipient,
        solPaymentAccount: req.paymentAccount.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [req.paymentAccount],
    }
  );
};
