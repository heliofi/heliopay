import { BN, Program } from '@coral-xyz/anchor';
import { PROGRAM_ID as METAPLEX_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { PROGRAM_ID as AUTH_RULES_PROGRAM_ID } from '@metaplex-foundation/mpl-token-auth-rules';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { HelioNftIdl } from './program';
import { EscrowNftRequest } from './types';
import {
  deriveEditionPDA,
  deriveTokenRecordPDA,
  getTransaction,
} from './utils';

export const getEscrowNftTx = async (
  program: Program<HelioNftIdl>,
  req: EscrowNftRequest
): Promise<Transaction> => {
  const { escrowAccount } = req;

  const ownerNftAccount = await getAssociatedTokenAddress(req.mint, req.owner);

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.mint,
    req.escrowAccount
  );

  const [escrowPda, bump] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  const ix = await program.methods
    .escrowNft(new BN(String(req.price)), new BN(req.fee), bump)
    .accounts({
      owner: req.owner,
      ownerNftAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      mint: req.mint,
      nftMetadataAccount: req.metadataAccount,
      currency: req.currency,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      systemProgram: SystemProgram.programId,
      nftMasterEdition: deriveEditionPDA(req.mint),
      ownerTokenRecord: deriveTokenRecordPDA(req.mint, ownerNftAccount),
      destinationTokenRecord: deriveTokenRecordPDA(req.mint, escrowNftAccount),
      authRulesProgram: AUTH_RULES_PROGRAM_ID,
      authRules: req.authRules || AUTH_RULES_PROGRAM_ID,
      metaplexMetadataProgram: METAPLEX_METADATA_PROGRAM_ID,
    })
    .instruction();

  return getTransaction(ix);
};
