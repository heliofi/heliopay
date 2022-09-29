import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { Account, SinglePaymentRequest } from './types';
import './config';
import { helioFeeWalletKey, daoFeeWalletKey } from './config';

const prepareSplitPaymentsValues = (
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): { remainingAmounts: Array<BN>; remainingAccounts: Array<Account> } => {
  if (!amounts.length) {
    if (accounts.length > 0) {
      throw new Error('Remaining accounts when no amounts!');
    }
  }
  if (accounts.length !== amounts.length) {
    throw new Error('Remaining accounts not matching amounts!');
  }

  const remainingAmounts = [];
  const remainingAccounts = [];

  for (let i = 0; i < amounts.length; i++) {
    remainingAmounts.push(new BN(amounts[i]));
    remainingAccounts.push({
      pubkey: accounts[i],
      isWritable: true,
      isSigner: false,
    });
  }
  return { remainingAmounts, remainingAccounts };
};

export const singleSolPayment = async (
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  payFees: boolean,
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): Promise<string> => {
  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
  );

  return program.rpc.singleSolPayment(
    new BN(req.amount),
    payFees,
    remainingAmounts,
    {
      accounts: {
        sender: req.sender,
        recipient: req.recipient,
        helioFeeAccount: helioFeeWalletKey,
        daoFeeAccount: daoFeeWalletKey,
        systemProgram: SystemProgram.programId,
      },
      remainingAccounts,
    }
  );
};
