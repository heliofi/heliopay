import { SystemProgram } from '@solana/web3.js';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { CreatePaymentStateRequest } from './types';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

export const createSolPayment = async (
  program: Program<HelioIdl>,
  req: CreatePaymentStateRequest,
  payFees: boolean = true
): Promise<string> =>
  program.rpc.createSolPayment(
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
  );
