import { BigNumber } from 'ethers';

export type RecipientAndAmount = {
  recipient: string;
  amount: BigNumber;
};

export type PaymentRequest = {
  walletAddress: string;
  recipientAddress: string;
  amount: bigint;
  fee: number;
  transactonDbId: string;
  tokenAddres?: string;
};
