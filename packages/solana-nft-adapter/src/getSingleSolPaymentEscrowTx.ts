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
import { SinglePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getSingleSolPaymentEscrowTx = async (
  program: Program<HelioNftIdl>,
  req: SinglePaymentRequest
): Promise<Transaction> => {
  const escrowAccount = req.escrowAccount;

  const senderNftAccount = await getAssociatedTokenAddress(
    req.nftMint,
    req.sender
  );

  const escrowNftAccount = await getAssociatedTokenAddress(
    req.nftMint,
    daoFeeWalletKey
  );

  const [escrowPda, _] = await PublicKey.findProgramAddress(
    [escrowAccount.toBytes()],
    program.programId
  );

  return await program.methods
    .singleSolPaymentEscrow()
    .accounts({
      sender: req.sender,
      senderNftAccount,
      recipient: req.recipient,
      escrowAccount,
      escrowNftAccount,
      escrowPda,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      mint: req.nftMint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
};
