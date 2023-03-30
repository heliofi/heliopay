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
import { BN, Program } from '@project-serum/anchor';
import { HelioNftIdl } from './program';
import { CancelEscrowRequest } from './types';

export const getCancelEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: CancelEscrowRequest
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
    .cancelEscrow()
    .accounts({
      owner: req.owner,
      ownerNftAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      mint: req.mint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
};
