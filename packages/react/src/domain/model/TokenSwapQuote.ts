import { Currency } from '@heliofi/common';

export interface TokenSwapQuote {
  paymentRequestId: string;
  routeTokenString: string;
  from: Currency;
  to: Currency;
  slippageBps: number;
  priceImpactPct: number;
  inAmount: number;
  outAmount: number;
  amount: number;
}
