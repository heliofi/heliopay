import { SystemProgram, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';

export const cancelPayment = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest
): Promise<string> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const mint = req.mintAddress!;

  // Find a token accounts
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

  const paymentAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.payment
  );

  return program.rpc.cancelPayment({
    accounts: {
      signer: req.sender,
      sender: req.sender,
      senderTokenAccount: senderAssociatedTokenAddress,
      recipient: req.recipient,
      recipientTokenAccount: recipientAssociatedTokenAddress,
      paymentAccount: req.payment,
      paymentTokenAccount: paymentAssociatedTokenAddress,
      pdaSigner: pda,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  });
};
