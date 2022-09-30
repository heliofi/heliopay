import { Cluster } from '@solana/web3.js';
import { ClusterType, Currency } from '../../domain';
import { configDev, configProd } from '../config';

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
      return 'https://test.api.hel.io';
    case ClusterType.Mainnet:
      return 'https://prod.api.hel.io';
    default:
      return 'https://test.api.hel.io';
  }
};

const HELIO_BASE_API_URL = 'https://api.hel.io/v1';

export const HelioApiAdapter = {
  async getPaymentRequestByIdPublic(
    id: string,
  ): Promise<any> {
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

  async listCurrencies(): Promise<Currency[]> {
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
};