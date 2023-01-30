import {
  Currency,
  FetchifyFindAddress,
  FetchifyRetrieveAddress,
  PaymentRequestType,
  SwapRouteToken,
  TokenQuoting,
} from "@heliofi/common";

export interface HelioApiConnector {
  findAddress(
    query: string,
    country_code: string
  ): Promise<FetchifyFindAddress>;
  retrieveAddress(
    address_id: string,
    country_code: string
  ): Promise<FetchifyRetrieveAddress>;

  listCurrencies(): Promise<Currency[]>;

  getPaymentRequestByIdPublic(id: string): Promise<any>;

  getTokenSwapMintAddresses(mintAddress: string): Promise<string[]>;

  getTokenSwapQuote(
    paymentRequestId: string,
    paymentRequestType: PaymentRequestType,
    fromMint: string,
    quantity?: number,
    normalizedPrice?: number,
    toMint?: string
  ): Promise<SwapRouteToken>;

  getLivePrice(
    amount: number,
    to: string,
    from: string,
    paymentRequestId?: string,
    paymentRequestType?: string
  ): Promise<TokenQuoting>;
}
