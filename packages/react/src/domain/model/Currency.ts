import { ReactNode } from 'react';

export interface Currency {
  symbolPrefix: ReactNode;
  symbol?: string | null;
  name?: string | null;
  mintAddress?: string | null;
  decimals?: number | null;
  coinMarketCapId?: number | null;
  type: string;
  sign?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FiatCurrency {
  symbol: string;
  name: string;
  country?: string;
}
