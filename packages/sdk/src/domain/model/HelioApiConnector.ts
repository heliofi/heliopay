import {
  Currency,
  TokenQuoting,
  SwapRouteToken,
  PaymentRequest,
  PrepareTransaction,
  PaymentRequestType,
  FetchifyFindAddress,
  PrepareSwapTransaction,
  FetchifyRetrieveAddress,
  OnlyContentAndTransactionPaylink,
} from '@heliofi/common';

export interface HelioApiConnector {
  findAddress(
    query: string,
    country_code: string
  ): Promise<FetchifyFindAddress>;

  retrieveAddress(
    address_id: string,
    country_code: string
  ): Promise<FetchifyRetrieveAddress>;

  getCurrencies(): Promise<Currency[]>;

  getPaymentRequestByIdPublic(
    id: string,
    paymentType: PaymentRequestType
  ): Promise<PaymentRequest>;

  getTokenSwapMintAddresses(mintAddress: string): Promise<string[]>;

  getTokenSwapQuote(
    paymentRequestId: string,
    paymentRequestType: PaymentRequestType,
    fromMint: string,
    quantity?: number,
    totalDecimalAmount?: number,
    toMint?: string
  ): Promise<SwapRouteToken>;

  getLivePrice(
    amount: number,
    to: string,
    from: string,
    paymentRequestId?: string,
    paymentRequestType?: string
  ): Promise<TokenQuoting>;

  getPreparedTransactionMessage(
    url: string,
    body: string
  ): Promise<PrepareTransaction>;

  getPreparedTransactionSwapMessage(
    url: string,
    body: string
  ): Promise<PrepareSwapTransaction>;

  getTransactionStatus(
    statusToken: string,
    endpoint?: string
  ): Promise<OnlyContentAndTransactionPaylink>;
}
