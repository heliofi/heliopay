export type PaymentEvent = {
  sender: string;
  recipient: string;
  tokenAddress: string;
  transferAmount: bigint;
  feeAmount: bigint;
};

export type EthPaymentEvent = {
  sender: string;
  recipient: string;
  transferAmount: bigint;
  feeAmount: bigint;
};

export enum EventName {
  Payment = 'Payment',
  EthPayment = 'EthPayment',
  SplitPayment = 'SplitPayment',
  SplitEthPayment = 'SplitEthPayment',
}
