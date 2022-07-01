/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResult } from '@aws-amplify/api-graphql/lib';
import {
  currenciesByOrder,
  CurrenciesByOrderQuery,
  getPaymentRequestById,
  GetPaymentRequestByIdQuery,
} from '@heliofi/backend-api';
import { Amplify, API } from 'aws-amplify';


import { getAwsConfig } from '../config';

Amplify.configure(getAwsConfig());

enum AuthMode {
  AWS_LAMBDA = 'AWS_LAMBDA',
  API_KEY = 'API_KEY',
}

export const HelioApiAdapter = {
   getPaymentRequestById: async (id: string) => {
    const result = (await API.graphql({
      query: getPaymentRequestById,
      variables: {
        id,
      },
      authMode: AuthMode.API_KEY,
    })) as GraphQLResult<GetPaymentRequestByIdQuery>;
    return result.data?.getPaymentRequest;
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
  }
}
