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

  const senderAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.sender
  );

  const recipientAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const paymentAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.paymentAccount.publicKey
  );

  const helioFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    daoFeeWalletKey
  );

  // eslint-disable-next-line
  const [_pda, bump] = await PublicKey.findProgramAddress(
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
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      paymentAccount: req.paymentAccount.publicKey,
      paymentTokenAccount: paymentAssociatedTokenAddress,
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount: helioFeeTokenAccountAddress,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount: daoFeeTokenAccountAddress,
      mint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([req.paymentAccount])
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
