import { PublicKey } from '@solana/web3.js';

export type CreatePaymentRequest = {
  amount: string;
  startAt: string;
  endAt: string;
  interval: number;
  sender: PublicKey;
  recipient: PublicKey;
  paymentAccount: PublicKey;
  mintAddress?: PublicKey;
};

export type CancelPaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  payment: PublicKey;
  mintAddress?: PublicKey;
};

export type WithdrawRequest = {
  recipient: PublicKey;
  payment: PublicKey;
  mintAddress?: PublicKey;
};

export type TopupRequest = {
  amount: string;
  sender: PublicKey;
  payment: PublicKey;
  mintAddress?: PublicKey;
};

export type SinglePaymentRequest = {
  amount: string;
  sender: PublicKey;
  recipient: PublicKey;
  mintAddress: PublicKey;
};

export type SingleTransactionProps = {
  transactionSignature: string;
  amount: string;
  sender: string;
  recipient: string;
  currency?: string;
};

export interface Account {
  pubkey: PublicKey;
  isWritable: boolean;
  isSigner: boolean;
}
