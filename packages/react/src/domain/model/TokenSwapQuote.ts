import { Currency } from './Currency';

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
