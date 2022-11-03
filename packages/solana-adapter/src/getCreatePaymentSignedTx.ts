import {
  Connection,
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getCreatePaymentSignedTx = async (
  connection: Connection,
  wallet: AnchorWallet,
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest,
  payFees: boolean = true
): Promise<string> => {
  const mint = req.mintAddress!;

  const senderTokenAccount = await getAssociatedTokenAddress(mint, req.sender);

  const recipientTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.paymentAccount.publicKey
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
    [req.paymentAccount.publicKey.toBytes()],
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
      paymentAccount: req.paymentAccount.publicKey,
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

  return signTransaction(transaction, wallet, connection, req.paymentAccount);
};
