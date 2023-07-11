import { Program } from '@coral-xyz/anchor';
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
import { SinglePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import {
  deriveEditionPDA,
  deriveMetadataPDA,
  deriveTokenRecordPDA,
  getTransaction,
} from './utils';

export const getSinglePaymentEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: SinglePaymentRequest
): Promise<Transaction> => {
  const { mint, currency } = req;
  const { escrowAccount } = req;

  const senderTokenAccount = await getAssociatedTokenAddress(
    currency,
    req.sender
  );

  const senderNftAccount = await getAssociatedTokenAddress(mint, req.sender);
  const recipientTokenAccount = await getAssociatedTokenAddress(
    currency,
    req.recipient
  );

  const helioFeeTokenAccount = await getAssociatedTokenAddress(
    currency,
    helioFeeWalletKey
  );

  const daoFeeTokenAccount = await getAssociatedTokenAddress(
    currency,
    daoFeeWalletKey
  );

  const escrowNftAccount = await getAssociatedTokenAddress(mint, escrowAccount);

  const [escrowPda, _] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  const ix = await program.methods
    .singlePaymentEscrow()
    .accounts({
      sender: req.sender,
      helioSignatureWallet: req.helioSignatureWallet,
      senderTokenAccount,
      senderNftAccount,
      recipient: req.recipient,
      recipientTokenAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      nftMetadataAccount: deriveMetadataPDA(mint),
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      helioFeeTokenAccount,
      daoFeeTokenAccount,
      mint,
      currency,
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
