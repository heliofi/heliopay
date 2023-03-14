import {
  Currency,
  FetchifyFindAddress,
  FetchifyRetrieveAddress,
  Paylink,
  PaymentRequest,
  PaymentRequestType,
  PrepareSwapTransaction,
  PrepareTransaction,
  SwapRouteToken,
  TokenQuoting,
} from '@heliofi/common';
import type { ConfigService, HelioApiConnector } from '../../domain';
import { enhanceOptions, FetchOptions, request } from '../fetch-middleware';

export class HelioApiAdapter implements HelioApiConnector {
  constructor(private configService: ConfigService) {}

  // @todo-v check this case
  async getPaymentRequestTypeById(id: string): Promise<PaymentRequestType> {
    const payData = await this.publicRequest<Paylink>(
      `/paylink/${id}/public`,
      { method: 'GET' },
      true
    );
    if (payData) {
      return PaymentRequestType.PAYLINK;
    }
    return PaymentRequestType.PAYSTREAM;
  }

  async getPaymentRequestByIdPublic(id: string): Promise<PaymentRequest> {
    let param;
    switch (this.configService.getPaymentRequestType()) {
      case PaymentRequestType.PAYLINK:
        param = 'paylink';
        break;
      case PaymentRequestType.PAYSTREAM:
        param = 'paystream';
        break;
      default:
        break;
    }

    const res = this.publicRequest<PaymentRequest>(
      `/${param}/${id}/public`,
      { method: 'GET' },
      true
    );

    return PaymentRequest.fromObject(res);
  }

  async findAddress(
    query: string,
    country_code: string
  ): Promise<FetchifyFindAddress> {
    return this.publicRequest<FetchifyFindAddress>(
      `/location/find-address?query=${query}&countryCode=${country_code}`,
      { method: 'GET' },
      true
    );
  }

  async retrieveAddress(
    address_id: string,
    country_code: string
  ): Promise<FetchifyRetrieveAddress> {
    return this.publicRequest<FetchifyRetrieveAddress>(
      `/location/retrieve-address?id=${address_id}&country=${country_code}`,
      { method: 'GET' },
      true
    );
  }

  async listCurrencies(): Promise<Currency[]> {
    return this.publicRequest<Currency[]>('/currency', { method: 'GET' }, true);
  }

  async getTokenSwapMintAddresses(mintAddress: string): Promise<string[]> {
    return this.publicRequest<any>(
      `/swap/mint-routes/${mintAddress}`,
      { method: 'GET' },
      true
    );
  }

  async getPreparedTransactionMessage(
    url: string,
    body: string
  ): Promise<PrepareTransaction> {
    return this.publicRequest<PrepareTransaction>(
      url,
      {
        method: 'POST',
        body,
      },
      true
    );
  }

  async getPreparedTransactionSwapMessage(
    url: string,
    body: string
  ): Promise<PrepareSwapTransaction> {
    return this.publicRequest<PrepareSwapTransaction>(
      url,
      {
        method: 'POST',
        body,
      },
      true
    );
  }

  async getLivePrice(
    amount: number,
    to: string,
    from: string,
    paymentRequestId?: string,
    paymentRequestType?: string
  ): Promise<TokenQuoting> {
    let queryParams = '';
    queryParams += `&amount=${amount}`;
    queryParams += `&to=${to}`;
    queryParams += `&from=${from}`;

    if (paymentRequestId != null) {
      queryParams += `&paymentRequestId=${paymentRequestId}`;
    }
    if (paymentRequestType != null) {
      queryParams += `&paymentRequestType=${paymentRequestType}`;
    }

    return this.publicRequest<TokenQuoting>(
      `/token-quoting?${queryParams}`,
      {
        method: 'GET',
      },
      true
    );
  }

  async getTokenSwapQuote(
    paymentRequestId: string,
    paymentRequestType: PaymentRequestType,
    fromMint: string,
    quantity?: number,
    normalizedPrice?: number,
    toMint?: string
  ): Promise<SwapRouteToken> {
    const url = `/swap/route-token`;

    const options: {
      [key: string]: string;
    } = {
      paymentRequestId,
      paymentRequestType,
      fromMint,
      ...(toMint ? { toMint } : {}),
    };

    if (quantity) {
      options.quantity = quantity.toString();
    }

    if (normalizedPrice != null) {
      options.amount = normalizedPrice.toString();
    }

    const urlParams = new URLSearchParams(options);

    return this.publicRequest<SwapRouteToken>(
      `${url}?${urlParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  private async publicRequest<T>(
    endpoint: string,
    options: FetchOptions = {},
    shouldParseJSON = false
  ): Promise<T> {
    return request<T>(
      this.configService.getHelioApiBaseUrl() + endpoint,
      enhanceOptions(options),
      shouldParseJSON
    );
  }
}
