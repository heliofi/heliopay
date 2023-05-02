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
import { Program } from '@coral-xyz/anchor';
import { HelioNftIdl } from './program';
import { CancelEscrowRequest } from './types';

export const getCancelEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: CancelEscrowRequest
): Promise<Transaction> => {
  const { escrowAccount } = req;

  const ownerNftAccount = await getAssociatedTokenAddress(req.mint, req.owner);

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.mint,
    req.escrowAccount
  );

  const [escrowPda, _bump] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  return program.methods
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
