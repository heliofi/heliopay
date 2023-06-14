import { PublicKey } from '@solana/web3.js';

export type SinglePaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  currency: PublicKey;
  metadataAccount: PublicKey;
  authRules?: PublicKey;
};

export type EscrowNftRequest = {
  price: BigInt;
  fee: number;
  owner: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  metadataAccount: PublicKey;
  currency: PublicKey;
  authRules?: PublicKey;
};

export type CancelEscrowRequest = {
  sender: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  metadataAccount: PublicKey;
  authRules?: PublicKey;
};
