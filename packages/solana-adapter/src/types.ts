import { Keypair, PublicKey } from '@solana/web3.js';

export type CreatePaymentRequest = {
  amount: number;
  startAt: number;
  endAt: number;
  interval: number;
  sender: PublicKey;
  recipient: PublicKey;
  paymentAccount: Keypair;
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
  amount: number;
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
