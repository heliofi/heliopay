import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { TopupRequest } from './types';
import { getProgramId } from './utils';

export const getTopupTx = async (
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<Transaction> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const mint = req.mintAddress!;

  const senderTokenAccount = await getAssociatedTokenAddress(mint, req.sender);

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.payment
  );

  const tokenProgram = getProgramId(req.tokenProgram);

  const transaction = await program.methods
    .topup(new BN(req.amount))
    .accounts({
      sender: req.sender,
      senderTokenAccount,
      paymentAccount: req.payment,
      paymentTokenAccount,
      pdaSigner: pda,
      tokenProgram,
    })
    .transaction();

  return transaction;
};
