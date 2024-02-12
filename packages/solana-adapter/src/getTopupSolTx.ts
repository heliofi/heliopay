import { BN, Program } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';
import { HelioIdl } from './program';
import { TopupRequest } from './types';

export const getTopupSolTx = async (
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<Transaction> => {
  const transaction = await program.methods
    .topupSol(new BN(req.amount))
    .accounts({
      sender: req.sender,
      solPaymentAccount: req.payment,
    })
    .transaction();

  return transaction;
};
