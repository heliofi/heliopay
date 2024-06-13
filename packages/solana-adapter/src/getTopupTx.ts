import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { TopupRequest } from './types';

export const getTopupTx = async (
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<Transaction> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const { mintAddress, tokenProgram } = req;

  if (!mintAddress) {
    throw new Error('mintAddress address is required for cancel payment');
  }

  const senderTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    req.sender
  );

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    req.payment
  );

  const transaction = await program.methods
    .topup(new BN(req.amount))
    .accounts({
      sender: req.sender,
      senderTokenAccount,
      paymentAccount: req.payment,
      paymentTokenAccount,
      pdaSigner: pda,
      mint: mintAddress,
      tokenProgram,
    })
    .transaction();

  return transaction;
};
