import { Currency, PrepareTransaction } from '@heliofi/common';
import { Cluster } from '@solana/web3.js';
import { LivePriceResponse } from '../../domain/model/TokenConversion';
import { getAddressApiBaseUrl, getHelioApiBaseUrl } from '../config';
import { publicRequest } from '../fetch-middleware';

export class HelioApiAdapter {
  async getPaymentRequestByIdPublic(
    id: string,
    cluster: Cluster
  ): Promise<any> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/paylink/${id}/public`;
    const paymentResult = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return paymentResult;
  }

  async getCountry(cluster: Cluster): Promise<any> {
    const ADDRESS_API_BASE_URL = getAddressApiBaseUrl(cluster);
    const url = `${ADDRESS_API_BASE_URL}/api/getCountry`;
    const result = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return result;
  }

  async findAddress(
    query: string,
    country_code: string,
    cluster: Cluster
  ): Promise<any> {
    const ADDRESS_API_BASE_URL = getAddressApiBaseUrl(cluster);
    const url = `${ADDRESS_API_BASE_URL}/api/findAddress?query=${query}&country=${country_code}`;
    const result = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return result;
  }

  async retrieveAddress(
    address_id: string,
    country_code: string,
    cluster: Cluster
  ): Promise<any> {
    const ADDRESS_API_BASE_URL = getAddressApiBaseUrl(cluster);
    const url = `${ADDRESS_API_BASE_URL}/api/retrieveAddress?id=${address_id}&country=${country_code}`;
    const result = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return result;
  }

  async listCurrencies(cluster: Cluster): Promise<Currency[]> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/currency`;

    const currencies = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return currencies || [];
  }

  async getLivePrice(
    amount: number,
    to: string,
    from: string,
    cluster: Cluster
  ): Promise<LivePriceResponse> {
    let queryParams = '';
    queryParams += `&amount=${amount}`;
    queryParams += `&to=${to}`;
    queryParams += `&from=${from}`;

    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/token-quoting?${queryParams}`;

    const livePrice = await (
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();

    return livePrice;
  }

  static async getPreparedTransactionMessage(
    url: string,
    body: string,
    cluster: Cluster
  ): Promise<PrepareTransaction> {
    return publicRequest<PrepareTransaction>(
      url,
      cluster,
      {
        method: 'POST',
        body,
      },
      true
    );
  }
}
