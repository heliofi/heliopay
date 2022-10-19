import { Connection, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { SinglePaymentRequest } from './types';
import './config';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getSinglePaymentSignedTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  payFees: boolean = true
): Promise<string> => {
  const mint = req.mintAddress;

  const senderAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.sender
  );

  const recipientAssociatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const helioFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    daoFeeWalletKey
  );

  const transaction = await program.methods
    .singlePayment(new BN(req.amount), payFees, [], {
      accounts: {
        sender: req.sender,
        senderTokenAccount: senderAssociatedTokenAddress,
        recipient: req.recipient,
        recipientTokenAccount: recipientAssociatedTokenAddress,
        mint,
        helioFeeAccount: helioFeeWalletKey,
        helioFeeTokenAccount: helioFeeTokenAccountAddress,
        daoFeeAccount: daoFeeWalletKey,
        daoFeeTokenAccount: daoFeeTokenAccountAddress,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    })
    .transaction();

  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  const signedTransaction = await wallet.signTransaction(transaction);

  return JSON.stringify(signedTransaction.serialize());
};
