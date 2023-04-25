import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export const txOpts: anchor.web3.ConfirmOptions = {
  skipPreflight: true,
  commitment: 'confirmed',
  maxRetries: 3,
};

export const helioFeeWalletKey = new PublicKey(
  'FudPMePeNqmnjMX19zEKDfGXpbp6HAdW6ZGprB5gYRTZ'
);

export const daoFeeWalletKey = new PublicKey(
  'JBGUGPmKUEHCpxGGoMowQxoV4c7HyqxEnyrznVPxftqk'
);
