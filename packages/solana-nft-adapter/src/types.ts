import { PublicKey } from '@solana/web3.js';

export type SinglePaymentRequest = {
  sender: PublicKey;
  recipient: PublicKey;
  escrowAccount: PublicKey;
  amount: string;
  currency: PublicKey;
  nftMint: PublicKey;
};

export interface Account {
  pubkey: PublicKey;
  isWritable: boolean;
  isSigner: boolean;
}
