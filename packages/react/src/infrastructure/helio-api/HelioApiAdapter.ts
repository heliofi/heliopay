import { Currency } from '@heliofi/common';
import { Cluster } from '@solana/web3.js';
import { ClusterType } from '../../domain';
import { LivePriceResponse } from '../../domain/model/TokenConversion';
import { configDev, configProd } from '../config';

const DEV_ADDRESS_SERVICE_BASE_URL = 'https://dev.hel.io';
const PROD_ADDRESS_SERVICE_BASE_URL = 'https://hel.io';

type FetchOptions = RequestInit & {
  clearContentType?: boolean;
};

export const getAwsConfig = (cluster: Cluster) => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return configDev;
    case ClusterType.Mainnet:
      return configProd;
    default:
      return configDev;
  }
};

export const getHelioApiBaseUrl = (cluster: Cluster) => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return 'https://dev.api.hel.io/v1';
    case ClusterType.Mainnet:
      return 'https://api.hel.io/v1';
    default:
      return 'https://api.hel.io/v1';
  }
};

export const getAddressApiBaseUrl = (cluster: Cluster) => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return DEV_ADDRESS_SERVICE_BASE_URL;
    case ClusterType.Mainnet:
      return PROD_ADDRESS_SERVICE_BASE_URL;
    default:
      return PROD_ADDRESS_SERVICE_BASE_URL;
  }
};

export const HelioApiAdapter = {
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
  },

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
  },

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
  },

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
  },

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
  },

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
  },

  async publicRequest<T>({
    endpoint,
    cluster,
    options = {},
    shouldParseJson = true,
  }: {
    endpoint: string;
    cluster: Cluster;
    options: FetchOptions;
    shouldParseJson?: boolean;
  }): Promise<T> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}${endpoint}`;
    const contentType = !options.clearContentType
      ? { 'Content-Type': 'application/json' }
      : null;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...contentType,
      },
    });
    if (shouldParseJson) {
      return (await response.json()) as T;
    }
    return (await response.text()) as any;
  },
};
