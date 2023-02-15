export interface BasePaymentResponse {
  transactionSignature: string;
  swapTransactionSignature?: string;
}

export interface SwapPaymentResponse {
  transactionSignature: string;
  swapTransactionSignature: string;
}
