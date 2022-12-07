import { Cluster } from '@solana/web3.js';

export interface BaseTransactionPayload {
  cluster: Cluster;
  signedTransaction: string;
  transactionToken?: string;
  streamToken?: string;
}
