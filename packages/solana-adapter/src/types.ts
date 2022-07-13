import { Cluster, Keypair, PublicKey } from '@solana/web3.js';

export type CreatePaymentStateRequest = {
  amount: number;
  startAt: Date;
  endAt: Date;
  interval: number;
  sender: PublicKey;
  recipient: PublicKey;
  paymentAccount: Keypair;
  MINT?: PublicKey;
};

export type CancelPaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  payment: PublicKey;
  MINT?: PublicKey;
};

export type WithdrawRequest = {
  recipient: Keypair;
  payment: PublicKey;
  MINT?: PublicKey;
};

export type SinglePaymentRequest = {
  amount: number;
  sender: PublicKey;
  recipient: PublicKey;
  mintAddress: PublicKey;
  cluster: Cluster;
};

export type SingleTransactionProps = {
  transactionSignature: string;
  amount: number;
  sender: string;
  recipient: string;
  currency?: string;
  cluster: string;
};

export interface Account {
  pubkey: PublicKey;
  isWritable: boolean;
  isSigner: boolean;
}
