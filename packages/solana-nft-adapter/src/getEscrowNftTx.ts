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
  deriveMetadataPDA,
  deriveTokenRecordPDA,
  getTransaction,
} from './utils';

export const getEscrowNftTx = async (
  program: Program<HelioNftIdl>,
  req: EscrowNftRequest
): Promise<Transaction> => {
  const { mint, escrowAccount } = req;

  const ownerNftAccount = await getAssociatedTokenAddress(mint, req.owner);

  const escrowNftAccount = await getAssociatedTokenAddress(
    mint,
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
      helioSignatureWallet: req.helioSignatureWallet,
      ownerNftAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      mint,
      nftMetadataAccount: deriveMetadataPDA(mint),
      currency: req.currency,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      systemProgram: SystemProgram.programId,
      nftMasterEdition: deriveEditionPDA(mint),
      ownerTokenRecord: deriveTokenRecordPDA(mint, ownerNftAccount),
      destinationTokenRecord: deriveTokenRecordPDA(mint, escrowNftAccount),
      authRulesProgram: AUTH_RULES_PROGRAM_ID,
      authRules: req.authRules || AUTH_RULES_PROGRAM_ID,
      metaplexMetadataProgram: METAPLEX_METADATA_PROGRAM_ID,
    })
    .instruction();

  return getTransaction(ix);
};
