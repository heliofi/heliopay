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
import { SinglePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getSinglePaymentEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: SinglePaymentRequest
): Promise<Transaction> => {
  const currency = req.currency;
  const escrowAccount = req.escrowAccount;

  const senderTokenAccount = await getAssociatedTokenAddress(
    currency,
    req.sender
  );

  const senderNftAccount = await getAssociatedTokenAddress(
    req.nftMint,
    req.sender
  );
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

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.nftMint,
    escrowAccount
  );

  const [escrowPda, _] = PublicKey.findProgramAddressSync(
    [escrowAccount.toBytes()],
    program.programId
  );

  return await program.methods
    .singlePaymentEscrow()
    .accounts({
      sender: req.sender,
      senderTokenAccount,
      senderNftAccount,
      recipient: req.recipient,
      recipientTokenAccount,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      helioFeeTokenAccount,
      daoFeeTokenAccount,
      mint: req.nftMint,
      currency,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
};
