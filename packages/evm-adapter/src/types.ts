import { BigNumber } from 'ethers';

export type RecipientAndAmount = {
  recipient: string;
  amount: BigNumber;
};

export type PaymentRequest = {
  walletAddress: string;
  recipientAddress: string;
  amount: bigint;
  tokenAddres?: string;
  fee: number;
  transactonDbId: string;
};
