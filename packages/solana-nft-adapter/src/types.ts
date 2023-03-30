import { PublicKey } from '@solana/web3.js';

export type SinglePaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  escrowAccount: PublicKey;
  amount: BigInt;
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
