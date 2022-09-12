import {
  Connection,
  SystemProgram,
  PublicKey,
  Transaction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { BN, Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';
import { feeWalletKey } from './config';

export const getSignedCreatePaymentTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest,
  payFees: boolean
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

  const feeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    feeWalletKey
  );

  // eslint-disable-next-line
  const [_pda, bump] = await PublicKey.findProgramAddress(
    [req.paymentAccount.publicKey.toBytes()],
    program.programId
  );

  const tx = program.transaction.createPayment(
    new BN(req.amount),
    new BN(req.startAt),
    new BN(req.endAt),
    new BN(req.interval),
    bump,
    payFees,
    {
      accounts: {
        sender: req.sender,
        senderTokenAccount: senderAssociatedTokenAddress,
        recipient: req.recipient,
        recipientTokenAccount: recipientAssociatedTokenAddress,
        paymentAccount: req.paymentAccount.publicKey,
        paymentTokenAccount: paymentAssociatedTokenAddress,
        feeAccount: feeWalletKey,
        feeTokenAccount: feeTokenAccountAddress,
        mint,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      signers: [req.paymentAccount],
    }
  );

  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const signedTx = await wallet.signTransaction(tx);

  return JSON.stringify(signedTx.serialize());
};
