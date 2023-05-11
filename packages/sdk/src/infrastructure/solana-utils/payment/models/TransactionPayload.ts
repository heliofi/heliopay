export interface BaseTransactionPayload {
  signedTransaction: string;
  signedSwapTransaction?: string;
  transactionToken?: string;
  streamToken?: string;
}
