import { ClusterHelioType } from '../../../../domain';

export interface BaseTransactionPayload {
  cluster?: ClusterHelioType;
  signedTransaction: string;
  signedSwapTransaction?: string;
  transactionToken?: string;
  streamToken?: string;
}
