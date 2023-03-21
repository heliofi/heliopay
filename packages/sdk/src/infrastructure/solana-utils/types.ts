import { SplitWallet } from '@heliofi/common';

export type TransactionSignatureAndToken = {
  signature?: string;
  token?: string;
  error?: Error;
};

export type SignedTxAndToken = {
  swapSignedTx?: string;
  signedTx?: string;
  token?: string;
  error?: Error;
};

export type ExecuteTransactionPayload<TransactionParams> = {
  request: TransactionParams;
  symbol: string;
  quantity?: number;
  splitWallets?: SplitWallet[];
  canSwapTokens?: boolean;
  swapRouteToken?: string;
  fixedCurrencyRateToken?: string;
};
