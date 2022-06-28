import { GraphQLResult } from '@aws-amplify/api-graphql/lib';
import { API } from 'aws-amplify';
import {
  currenciesByOrder,
  CurrenciesByOrderQuery,
} from '@heliofi/backend-api';

enum AuthMode {
  AWS_LAMBDA = 'AWS_LAMBDA',
  API_KEY = 'API_KEY',
}

export class HelioApiAdapter {
  async listCurrencies(): Promise<any> {
    const result = (await API.graphql({
      query: currenciesByOrder,
      variables: {
        type: 'token',
      },
      authMode: AuthMode.API_KEY,
    })) as GraphQLResult<CurrenciesByOrderQuery>;

    return result.data?.currenciesByOrder;
  }
}
