import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
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
  const { mintAddress, tokenProgram } = req;

  if (!mintAddress) {
    throw new Error('mintAddress address is required for cancel payment');
  }

  // TODO: change for token2022
  const senderTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    req.sender
  );

  const recipientTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    req.recipient
  );

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    req.paymentAccount
  );

  const helioFeeTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    helioFeeWalletKey
  );

  const daoFeeTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
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
      mint: mintAddress,
      tokenProgram,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
