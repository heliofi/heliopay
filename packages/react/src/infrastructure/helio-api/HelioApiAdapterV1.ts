import {publicRequest} from "../fetch-middleware";
import {Cluster} from "@solana/web3.js";

export class HelioApiAdapterV1 {
    static async getPreparedTransactionMessage(
    url: string,
    body: string,
    cluster: Cluster
  ): Promise<any> {
    return await publicRequest<any>(
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
    return await publicRequest<any>(
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
    normalizedPrice?: number,
  ): Promise<any> {
    const url = '/swap/route-token';

    const options: {
      [key: string]: string;
    } = {
      paymentRequestId: paymentRequestId,
      paymentRequestType: paymentRequestType,
      fromMint: fromMint,
    };

    if (quantity != null) {
      options['quantity'] = quantity.toString();
    }

    if (normalizedPrice != null) {
      options['amount'] = normalizedPrice.toString();
    }

    const urlParams = new URLSearchParams(options);

    return await publicRequest<any>(
      `${url}?${urlParams.toString()}`,
      cluster,
      { method: 'GET' },
      true
    );
  }

  async getTokenSwapCurrencies(mintAddress: string, cluster: Cluster): Promise<string[]> {
    return await publicRequest<string[]>(
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
    paymentRequestType?: string,
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
