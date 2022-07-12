import { Currency } from "../../domain";

export declare type CurrenciesByOrderQuery = {
  currenciesByOrder?: {
    __typename: 'ModelCurrencyConnection';
    items: Currency[];
    nextToken?: string | null;
  } | null;
};
export const currenciesByOrder =
  '\n  query CurrenciesByOrder(\n    $type: String!\n    $order: ModelIntKeyConditionInput\n    $sortDirection: ModelSortDirection\n    $filter: ModelCurrencyFilterInput\n    $limit: Int\n    $nextToken: String\n  ) {\n    currenciesByOrder(\n      type: $type\n      order: $order\n      sortDirection: $sortDirection\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n    ) {\n      items {\n        id\n        symbol\n        name\n        mintAddress\n        decimals\n        coinMarketCapId\n        type\n        sign\n        order\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n';
