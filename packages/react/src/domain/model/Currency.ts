export interface Currency {
  symbol: string;
  name: string;
  mintAddress?: string;
  decimals: number;
  coinMarketCapId?: number;
}

export interface FiatCurrency {
  symbol: string;
  name: string;
  country?: string;
}
