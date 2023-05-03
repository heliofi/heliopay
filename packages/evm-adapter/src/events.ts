import { RecipientAndAmount } from './types';

export type PaymentEvent = {
  sender: string;
  recipient: string;
  tokenAddress: string;
  transferAmount: bigint;
  feeAmount: bigint;
  transactionDbId: string;
};

export type EthPaymentEvent = {
  sender: string;
  recipient: string;
  transferAmount: bigint;
  feeAmount: bigint;
  transactionDbId: string;
};

export type SplitPaymentEvent = {
  sender: string;
  recipient: string;
  tokenAddress: string;
  transferAmount: bigint;
  feeAmount: bigint;
  splitData: RecipientAndAmount[];
  transactionDbId: string;
};

export type SplitEthPaymentEvent = {
  sender: string;
  recipient: string;
  transferAmount: bigint;
  feeAmount: bigint;
  splitData: RecipientAndAmount[];
  transactionDbId: string;
};

export enum EventName {
  PAYMENT = 'Payment',
  ETH_PAYMENT = 'EthPayment',
  SPLIT_PAYMENT = 'SplitPayment',
  SPLIT_ETH_PAYMENT = 'SplitEthPayment',
}
