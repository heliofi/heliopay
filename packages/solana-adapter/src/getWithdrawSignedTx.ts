import { Connection, SystemProgram, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getWithdrawSignedTx = async (
  connection: Connection,
  wallet: AnchorWallet,
  program: Program<HelioIdl>,
  req: WithdrawRequest
): Promise<string> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const mint = req.mintAddress!;

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

  const transaction = await program.methods
    .withdraw()
    .accounts({
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
    })
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
