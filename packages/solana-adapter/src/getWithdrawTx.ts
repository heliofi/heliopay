import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { BN, Program } from '@coral-xyz/anchor';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const getWithdrawTx = async (
  program: Program<HelioIdl>,
  req: WithdrawRequest,
  fee: number = 0,
  otherSigner?: PublicKey
): Promise<Transaction> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const { mintAddress, tokenProgram } = req;

  if (!mintAddress) {
    throw new Error('mintAddress address is required for cancel payment');
  }

  // TODO: change for token2022
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
    .withdraw(new BN(fee))
    .accounts({
      signer: otherSigner || req.recipient,
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
