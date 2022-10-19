import { Connection, SystemProgram } from '@solana/web3.js';
import { BN, Program, Wallet } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';
import './config';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';
import { signTransaction } from './utils';

export const getCreateSolPaymentSignedTx = async (
  connection: Connection,
  wallet: Wallet,
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest,
  payFees: boolean = true
): Promise<string> => {
  const transaction = await program.methods
    .createSolPayment(
      new BN(req.amount),
      new BN(req.startAt),
      new BN(req.endAt),
      new BN(req.interval),
      payFees,
      {
        accounts: {
          sender: req.sender,
          recipient: req.recipient,
          solPaymentAccount: req.paymentAccount.publicKey,
          helioFeeAccount: helioFeeWalletKey,
          daoFeeAccount: daoFeeWalletKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [req.paymentAccount],
      }
    )
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
