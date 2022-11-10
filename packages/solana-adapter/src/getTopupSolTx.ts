import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { TopupRequest } from './types';

export const getTopupSolTx = async (
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<string> => {
  const transaction = await program.methods
    .topupSol(new BN(req.amount))
    .accounts({
      sender: req.sender,
      solPaymentAccount: req.payment,
    })
    .transaction();

  return JSON.stringify(transaction);
};
