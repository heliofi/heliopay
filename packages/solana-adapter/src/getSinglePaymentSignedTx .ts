import { Connection, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { SinglePaymentRequest } from './types';
import './config';

export const getSinglePaymentSignedTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: SinglePaymentRequest
): Promise<string> => {
  const mint = req.mintAddress;

  const senderAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.sender
  );

  const recipientAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.recipient
  );

  const tx = program.transaction.singlePayment(new BN(req.amount), [], {
    accounts: {
      sender: req.sender,
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      mint,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  });

  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const signedTx = await wallet.signTransaction(tx);

  return JSON.stringify(signedTx.serialize());
};
