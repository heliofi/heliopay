import { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './helioNftProtocol';

export const PROGRAM_ID = new PublicKey(idl.metadata.address);
export const IDL = idl as HelioNftIdl;

export type HelioNftIdl = Idl & {
  metadata: {
    address: string;
  };
};
