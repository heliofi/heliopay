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

export type Payment2Event = {
  sender: string;
  tokenAddress: string;
  transferAmount: bigint;
  splitData: RecipientAndAmount[];
  transactionDbId: string;
};

export enum EventName {
  PAYMENT = 'Payment',
  PAYMENT2 = 'Payment2',
  ETH_PAYMENT = 'EthPayment',
  SPLIT_PAYMENT = 'SplitPayment',
  SPLIT_ETH_PAYMENT = 'SplitEthPayment',
}
