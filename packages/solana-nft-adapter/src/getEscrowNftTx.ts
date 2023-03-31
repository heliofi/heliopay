import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioNftIdl } from './program';
import { EscrowNftRequest } from './types';

export const getEscrowNftTx = async (
  program: Program<HelioNftIdl>,
  req: EscrowNftRequest,
  fee: number = 0
): Promise<Transaction> => {
  const escrowAccount = req.escrowAccount;

  const ownerNftAccount = await getAssociatedTokenAddress(req.mint, req.owner);

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.mint,
    req.escrowAccount
  );

  const [escrowPda, bump] = await PublicKey.findProgramAddress(
    [escrowAccount.toBytes()],
    program.programId
  );

  return await program.methods
    .escrowfNft(new BN(String(req.price)), bump)
    .accounts({
      owner: req.owner,
      ownerNftAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      mint: req.mint,
      currency: req.currency,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
};
