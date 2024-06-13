import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getCancelPaymentTx = async (
  program: Program<HelioIdl>,
  req: CancelPaymentRequest,
  fee: number = 0
): Promise<Transaction> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const { mintAddress, tokenProgram } = req;

  if (!mintAddress) {
    throw new Error('Mint address is required for cancel payment');
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
    req.payment
  );

  const helioFeeTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    helioFeeWalletKey
  );

  const daoFeeTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    daoFeeWalletKey
  );

  const transaction = await program.methods
    .cancelPayment(new BN(fee))
    .accounts({
      signer: req.sender,
      sender: req.sender,
      senderTokenAccount,
      recipient: req.recipient,
      recipientTokenAccount,
      paymentAccount: req.payment,
      paymentTokenAccount,
      pdaSigner: pda,
      helioFeeAccount: helioFeeWalletKey,
      helioFeeTokenAccount,
      daoFeeAccount: daoFeeWalletKey,
      daoFeeTokenAccount,
      mint: mintAddress,
      tokenProgram,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
