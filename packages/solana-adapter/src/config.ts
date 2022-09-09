import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const txOpts: anchor.web3.ConfirmOptions = {
  skipPreflight: true,
  commitment: 'confirmed',
  maxRetries: 3,
};

export const feeWalletKey = new PublicKey(
  'FudPMePeNqmnjMX19zEKDfGXpbp6HAdW6ZGprB5gYRTZ'
);
