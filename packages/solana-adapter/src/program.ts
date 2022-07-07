import { Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './helio_protocol';

export const PROGRAM_ID = new PublicKey(idl.metadata.address);
export const IDL = idl as HelioIdl;

export type HelioIdl = Idl & {
  metadata: {
    address: string;
  };
};
