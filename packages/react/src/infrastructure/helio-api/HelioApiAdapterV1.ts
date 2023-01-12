import { Cluster } from '@solana/web3.js';
import { publicRequest } from '../fetch-middleware';

export class HelioApiAdapterV1 {
  static async getPreparedTransactionMessage(
    url: string,
    body: string,
    cluster: Cluster
  ): Promise<any> {
    return publicRequest<any>(
      url,
      cluster,
      {
        method: 'POST',
        body,
      },
      true
    );
  }

  static async getPreparedTransactionSwapMessage(
    url: string,
    body: string,
    cluster: Cluster
  ): Promise<any> {
    return publicRequest<any>(
      url,
      cluster,
      {
        method: 'POST',
        body,
      },
      true
    );
  }

  async getTokenSwapQuote(
    paymentRequestId: string,
    paymentRequestType: any,
    fromMint: string,
    cluster: Cluster,
    quantity?: number,
    normalizedPrice?: number
  ): Promise<any> {
    const url = '/swap/route-token';

    const options: {
      [key: string]: string;
    } = {
      paymentRequestId,
      paymentRequestType,
      fromMint,
    };

    if (quantity != null) {
      options.quantity = quantity.toString();
    }

    if (normalizedPrice != null) {
      options.amount = normalizedPrice.toString();
    }

    const urlParams = new URLSearchParams(options);

    return publicRequest<any>(
      `${url}?${urlParams.toString()}`,
      cluster,
      { method: 'GET' },
      true
    );
  }

  async getTokenSwapCurrencies(
    mintAddress: string,
    cluster: Cluster
  ): Promise<string[]> {
    return publicRequest<string[]>(
      `/swap/mint-routes/${mintAddress}`,
      cluster,
      { method: 'GET' },
      true
    );
  }

  async getLivePrice(
    amount: number,
    to: string,
    from: string,
    cluster: Cluster,
    paymentRequestId?: string,
    paymentRequestType?: string
  ): Promise<any> {
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

    return publicRequest<any>(
      `/token-quoting?${queryParams}`,
      cluster,
      {
        method: 'GET',
      },
      true
    );
  }
}
