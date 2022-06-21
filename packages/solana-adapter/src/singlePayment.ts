import {
  Transaction,
  sendAndConfirmRawTransaction,
  Connection,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Wallet } from '@project-serum/anchor/src/provider';
import { SinglePaymentRequest } from './types';
import './config';

export const singlePayment = async (
  connection: Connection,
  wallet: Wallet,
  req: SinglePaymentRequest
): Promise<any> => {
  console.error('Use payment over SC, this is to slow!');
  const mint = req.mintAddress;
  // Associated token accounts
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

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      senderAssociatedTokenAddress,
      recipientAssociatedTokenAddress,
      req.sender,
      [],
      req.amount
    )
  );

  // Find latest block and add to transaction
  const blockHash = await connection.getLatestBlockhash();
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = await blockHash.blockhash;

  // Sign and prepare
  const signed = await wallet.signTransaction(transaction);
  // const tx = await sendAndConfirmTransaction(connection, transaction, [wallet]);
  const tx = await sendAndConfirmRawTransaction(connection, signed.serialize());
  return { transaction: tx };
};
