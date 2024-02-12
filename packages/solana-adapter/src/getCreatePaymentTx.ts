import {
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { CreatePaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getCreatePaymentTx = async (
  program: Program<HelioIdl>,
  req: CreatePaymentRequest,
  payFees: boolean = true
): Promise<Transaction> => {
  const mint = req.mintAddress!;

  const senderTokenAccount = await getAssociatedTokenAddress(mint, req.sender);

  const recipientTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.paymentAccount
  );

  const helioFeeTokenAccount = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccount = await getAssociatedTokenAddress(
    mint,
    daoFeeWalletKey
  );

  const [, bump] = await PublicKey.findProgramAddress(
    [req.paymentAccount.toBytes()],
    program.programId
  );

  // Signers method is useless (signers removed after wallet sign)
  const transaction = await program.methods
    .createPayment(
      new BN(req.amount),
      new BN(req.startAt),
      new BN(req.endAt),
      new BN(req.interval),
      bump,
      payFees
    )
    .accounts({
      sender: req.sender,
      senderTokenAccount,
      recipient: req.recipient,
      recipientTokenAccount,
      paymentAccount: req.paymentAccount,
      paymentTokenAccount,
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount,
      mint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
