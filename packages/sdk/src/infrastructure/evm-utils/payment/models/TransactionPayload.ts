import { Cluster } from '../../../../domain/constants/blockchainNetworks';

export interface BaseTransactionPayload {
  cluster: Cluster;
  signedTransaction: string;
  signedSwapTransaction?: string;
  transactionToken?: string;
  streamToken?: string;
}
