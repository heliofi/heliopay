import { SystemProgram, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const cancelPayment = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest
): Promise<string> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
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
    req.payment
  );

  const helioFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccountAddress = await getAssociatedTokenAddress(
    mint,
    daoFeeWalletKey
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
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount: helioFeeTokenAccountAddress,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount: daoFeeTokenAccountAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  });
};
