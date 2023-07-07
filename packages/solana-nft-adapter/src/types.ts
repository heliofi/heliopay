import { PublicKey } from '@solana/web3.js';

export type SinglePaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  currency: PublicKey;
  helioSignatureWallet: PublicKey;
  authRules?: PublicKey;
};

export type EscrowNftRequest = {
  price: BigInt;
  fee: number;
  owner: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  currency: PublicKey;
  helioSignatureWallet: PublicKey;
  authRules?: PublicKey;
};

export type CancelEscrowRequest = {
  sender: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  helioSignatureWallet: PublicKey;
  authRules?: PublicKey;
};
