import { RecipientAndAmount } from './types';

type BasePaymentEvent = {
  sender: string;
  recipient: string;
  transferAmount: bigint;
  feeAmount: bigint;
  transactionDbId: string;
};

export type PaymentEvent = BasePaymentEvent & {
  tokenAddress: string;
};

export type EthPaymentEvent = BasePaymentEvent;

export type SplitPaymentEvent = BasePaymentEvent & {
  tokenAddress: string;
  splitData: RecipientAndAmount[];
};

export type SplitEthPaymentEvent = BasePaymentEvent & {
  splitData: RecipientAndAmount[];
};

export enum EventName {
  PAYMENT = 'Payment',
  ETH_PAYMENT = 'EthPayment',
  SPLIT_PAYMENT = 'SplitPayment',
  SPLIT_ETH_PAYMENT = 'SplitEthPayment',
}
