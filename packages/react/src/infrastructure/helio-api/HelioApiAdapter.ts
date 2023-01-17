import { Cluster } from '@solana/web3.js';
import { PaymentRequestType } from '@heliofi/common';
import { ClusterType, Currency } from '../../domain';
import { configDev, configProd } from '../config';

const DEV_ADDRESS_SERVICE_BASE_URL = 'https://dev.api.hel.io/v1';
const PROD_ADDRESS_SERVICE_BASE_URL = 'https://api.hel.io/v1';

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
    const url = `${ADDRESS_API_BASE_URL}/location/find-address?query=${query}&countryCode=${country_code}`;
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
    const url = `${ADDRESS_API_BASE_URL}/location/retrieve-address?id=${address_id}&country=${country_code}`;
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

  async getTokenSwapMintAddresses(
    mintAddress: string,
    cluster: Cluster
  ): Promise<string[]> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/swap/mint-routes/${mintAddress}`;

    const tokenSwapCurrencies = await (
      await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();
    return tokenSwapCurrencies || [];
  },

  async getTokenSwapQuote(
    cluster: Cluster,
    paymentRequestId: string,
    paymentRequestType: PaymentRequestType,
    fromMint: string,
    quantity: number,
    amount: number,
    toMint?: string,
  ): Promise<{ routeToken: string }> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/swap/route-token`;

    const urlParams = new URLSearchParams({
      paymentRequestId,
      paymentRequestType,
      fromMint,
      quantity: String(quantity),
      amount: String(amount),
      ...(toMint ? {toMint} : {})
    });

    const tokenSwapQuote = await (
      await fetch(`${url}?${String(urlParams)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();
    return tokenSwapQuote || {};
  },
};
