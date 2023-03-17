import {
  OnlyContentAndSwapTransactionPaylink,
  OnlyContentAndTransactionPaylink,
} from '@heliofi/common';

export class BasePaymentResponse extends OnlyContentAndTransactionPaylink {}

export class SwapPaymentResponse extends OnlyContentAndSwapTransactionPaylink {}

export type PaymentResponse = SwapPaymentResponse | BasePaymentResponse;

export type SwapResponse = { swapTransactionSignature?: string };

export const isSwapResponse = (response: unknown): response is SwapResponse =>
  (response as SwapResponse)?.swapTransactionSignature != null;
