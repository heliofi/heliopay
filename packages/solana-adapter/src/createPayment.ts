import {
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';

export const createPayment = async (
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest
): Promise<string> => {
  
  const mint = req.mintAddress!;
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

  const paymentAssociatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    req.paymentAccount.publicKey
  );

  // eslint-disable-next-line
  const [_pda, bump] = await PublicKey.findProgramAddress(
    [req.paymentAccount.publicKey.toBytes()],
    program.programId
  );

  // Create payment token acc in same transaction, SC can do it also but trying to save compute budget for program
  const instructions: TransactionInstruction[] = [];
  const createAssociatedTokenAccountInstruction =
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      paymentAssociatedTokenAddress,
      req.paymentAccount.publicKey, // Sender owner for now, authority transfered to PDA in program
      req.sender
    );
  instructions.push(createAssociatedTokenAccountInstruction);

  return program.rpc.createPayment(
    new BN(req.amount),
    new BN(req.startAt),
    new BN(req.endAt),
    new BN(req.interval),
    bump,
    {
      accounts: {
        sender: req.sender,
        senderTokenAccount: senderAssociatedTokenAddress,
        recipient: req.recipient,
        recipientTokenAccount: recipientAssociatedTokenAddress,
        paymentAccount: req.paymentAccount.publicKey,
        paymentTokenAccount: paymentAssociatedTokenAddress,
        mint,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      instructions,
      signers: [req.paymentAccount],
    }
  );
};
