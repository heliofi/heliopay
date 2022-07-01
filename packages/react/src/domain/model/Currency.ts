export interface Currency {
  symbol: string;
  name: string;
  mintAddress?: string;
  decimals: number;
  coinMarketCapId?: number;
  sign?: string;
}

export interface FiatCurrency {
  symbol: string;
  name: string;
  country?: string;
}
