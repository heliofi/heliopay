import { Web3Provider } from '@ethersproject/providers';
import {
  BlockchainSymbol,
  CustomerDetails,
  ProductDetails,
} from '@heliofi/common';

import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
  PaymentEvent,
  LoadingModalStep,
  ClusterHelioType,
} from '../../../../domain';

export interface BasePaymentProps<T> {
  onSuccess: (event: SuccessPaymentEvent<T>) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  onInitiated?: (event: PaymentEvent) => void;
  setLoadingModalStep: (step: LoadingModalStep) => void;
  onCancel?: () => void;
  symbol: string;
  blockchain?: BlockchainSymbol;
  anchorProvider: Web3Provider;
  rateToken?: string;
  customerDetails?: CustomerDetails;
  productDetails?: ProductDetails;
  mintAddress: string;
  isNativeMintAddress: boolean;
  cluster: ClusterHelioType;
}
