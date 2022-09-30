import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN, Program } from '@project-serum/anchor';
import { HelioIdl } from './program';
import { Account, SinglePaymentRequest } from './types';
import './config';

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

export const singleSolPaymentSC = async (
  program: Program<HelioIdl>,
  req: SinglePaymentRequest,
  amounts: Array<number> = [],
  accounts: Array<PublicKey> = []
): Promise<string> => {
  console.log('creating sol payment');

  
  const { remainingAmounts, remainingAccounts } = prepareSplitPaymentsValues(
    amounts,
    accounts
    );

  console.log(req, remainingAccounts, remainingAmounts);

  return program.rpc.singleSolPayment(new BN(req.amount), remainingAmounts, {
    accounts: {
      sender: req.sender,
      recipient: req.recipient,
      systemProgram: SystemProgram.programId,
    },
    remainingAccounts,
  });
};
