import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID as METAPLEX_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { PROGRAM_ID as AUTH_RULES_PROGRAM_ID } from '@metaplex-foundation/mpl-token-auth-rules';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { HelioNftIdl } from './program';
import { SinglePaymentRequest } from './types';
import {
  deriveEditionPDA,
  deriveMetadataPDA,
  deriveTokenRecordPDA,
  getTransaction,
} from './utils';

export const getSingleSolPaymentEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: SinglePaymentRequest
): Promise<Transaction> => {
  const { mint, escrowAccount } = req;

  const senderNftAccount = await getAssociatedTokenAddress(mint, req.sender);

  const escrowNftAccount = await getAssociatedTokenAddress(mint, escrowAccount);

  const [escrowPda, _] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  const ix = await program.methods
    .singleSolPaymentEscrow()
    .accounts({
      sender: req.sender,
      helioSignatureWallet: req.helioSignatureWallet,
      senderNftAccount,
      recipient: req.recipient,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      nftMetadataAccount: deriveMetadataPDA(mint),
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      mint,
      currency: NATIVE_MINT,
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
