import { RecipientAndAmount } from './types';

export type PaymentEvent = {
  sender: string;
  tokenAddress: string;
  transferAmount: bigint;
  splitData: RecipientAndAmount[];
  transactionDbId: string;
};

export enum EventName {
  PAYMENT = 'Payment',
  TRANSFER = 'Transfer',
}
