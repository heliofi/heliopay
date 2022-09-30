export interface Currency {
  symbol?: string;
  name?: string;
  mintAddress?: string;
  decimals?: number;
  coinMarketCapId?: number;
  type?: string;
  sign?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FiatCurrency {
  symbol: string;
  name: string;
  country?: string;
}
