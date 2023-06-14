import { CustomerDetails, ProductDetails, SplitWallet } from '@heliofi/common';
import { LoadingModalStep } from '../../domain';

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

  customerDetails?: CustomerDetails;

  productDetails?: ProductDetails;
  setLoadingModalStep?: (step: LoadingModalStep) => void;
  mintAddress: string;
};

export const ETH_SYMBOL = 'ETH';
