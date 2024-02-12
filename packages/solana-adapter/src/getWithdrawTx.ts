import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
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
  const mint = req.mintAddress!;

  const recipientTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.recipient
  );

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.payment
  );

  const helioFeeTokenAccount = await getAssociatedTokenAddress(
    mint,
    helioFeeWalletKey
  );

  const daoFeeTokenAccount = await getAssociatedTokenAddress(
    mint,
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
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return transaction;
};
