/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResult } from '@aws-amplify/api-graphql/lib';
import {
  currenciesByOrder,
  CurrenciesByOrderQuery,
} from '@heliofi/backend-api';
import { Amplify, API } from 'aws-amplify';
import { Cluster } from '../../domain';

import { getAwsConfig } from '../config';

Amplify.configure(getAwsConfig());

enum AuthMode {
  AWS_LAMBDA = 'AWS_LAMBDA',
  API_KEY = 'API_KEY',
}

const getHelioApiBaseUrl = (cluster: Cluster) => {
  switch (cluster) {
    case 'devnet':
      return 'https://test.api.hel.io';
    case 'mainnet':
      return 'https://test.api.hel.io';
    default:
      return 'https://test.api.hel.io';
  }
};

export const HelioApiAdapter = {
  async getPaymentRequestByIdPublic(id: string, cluster: Cluster): Promise<any> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
    const url = `${HELIO_BASE_API_URL}/payment-request/${id}`;
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

  listCurrencies: async () => {
    const result = (await API.graphql({
      query: currenciesByOrder,
      variables: {
        type: 'token',
      },
      authMode: AuthMode.API_KEY,
    })) as GraphQLResult<CurrenciesByOrderQuery>;
    return result.data?.currenciesByOrder?.items || [];
  },
};
