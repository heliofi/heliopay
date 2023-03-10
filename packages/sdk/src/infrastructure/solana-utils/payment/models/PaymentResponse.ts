import { ContentResponse } from '@heliofi/common';

export interface BasePaymentResponse {
  transactionSignature: string;
  swapTransactionSignature?: string;
  content?: ContentResponse;
}

export interface SwapPaymentResponse {
  transactionSignature: string;
  swapTransactionSignature: string;
}
