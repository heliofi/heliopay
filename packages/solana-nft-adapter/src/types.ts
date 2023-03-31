import { PublicKey } from '@solana/web3.js';

export type SinglePaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  escrowAccount: PublicKey;
  nftMint: PublicKey;
  currency: PublicKey;
};

export type EscrowNftRequest = {
  price: BigInt;
  owner: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
  currency: PublicKey;
};

export type CancelEscrowRequest = {
  owner: PublicKey;
  escrowAccount: PublicKey;
  mint: PublicKey;
};
