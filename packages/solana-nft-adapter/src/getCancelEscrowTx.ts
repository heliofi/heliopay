import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID as METAPLEX_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { PROGRAM_ID as AUTH_RULES_PROGRAM_ID } from '@metaplex-foundation/mpl-token-auth-rules';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { HelioNftIdl } from './program';
import { CancelEscrowRequest } from './types';
import {
  deriveEditionPDA,
  deriveMetadataPDA,
  deriveTokenRecordPDA,
  getTransaction,
} from './utils';

export const getCancelEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: CancelEscrowRequest
): Promise<Transaction> => {
  const { escrowAccount, mint } = req;

  const senderNftAccount = await getAssociatedTokenAddress(
    req.mint,
    req.sender
  );

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.mint,
    req.escrowAccount
  );

  const [escrowPda, _bump] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  const ix = await program.methods
    .cancelEscrow()
    .accounts({
      sender: req.sender,
      helioSignatureWallet: req.helioSignatureWallet,
      senderNftAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      nftMetadataAccount: deriveMetadataPDA(mint),
      mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      systemProgram: SystemProgram.programId,
      nftMasterEdition: deriveEditionPDA(mint),
      ownerTokenRecord: deriveTokenRecordPDA(mint, escrowNftAccount),
      destinationTokenRecord: deriveTokenRecordPDA(mint, senderNftAccount),
      authRulesProgram: AUTH_RULES_PROGRAM_ID,
      authRules: req.authRules || AUTH_RULES_PROGRAM_ID,
      metaplexMetadataProgram: METAPLEX_METADATA_PROGRAM_ID,
    })
    .instruction();

  return getTransaction(ix);
};
