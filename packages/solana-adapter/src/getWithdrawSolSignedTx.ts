import { Connection, SystemProgram } from '@solana/web3.js';
import { Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { WithdrawRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getWithdrawSolSignedTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: WithdrawRequest
): Promise<string> => {
  const transaction = await program.methods
    .withdrawSol({
      accounts: {
        recipient: req.recipient,
        solPaymentAccount: req.payment,
        helioFeeAccount: helioFeeWalletKey,
        daoFeeAccount: daoFeeWalletKey,
        systemProgram: SystemProgram.programId,
      },
    })
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
