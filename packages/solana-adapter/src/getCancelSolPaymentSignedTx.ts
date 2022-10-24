import { Connection, SystemProgram } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { HelioIdl } from './program';
import { CancelPaymentRequest } from './types';
import './config';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getCancelSolPaymentSignedTx = async (
  connection: Connection,
  wallet: AnchorWallet,
  program: Program<HelioIdl>,
  req: CancelPaymentRequest
): Promise<string> => {
  const transaction = await program.methods
    .cancelSolPayment()
    .accounts({
      signer: req.sender,
      sender: req.sender,
      recipient: req.recipient,
      solPaymentAccount: req.payment,
      helioFeeAccount: helioFeeWalletKey,
      daoFeeAccount: daoFeeWalletKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
