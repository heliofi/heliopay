import { Cluster } from '@solana/web3.js';
import { ClusterType, Currency } from '../model';

export enum SupportedCurrency {
  USDC = 'USDC',
  SOL = 'SOL',
  DUST = 'DUST',
  USDT = 'USDT',
  PUFF = 'PUFF',
  ALL = 'ALL',
  FOXY = 'FOXY',
  FORGE = 'FORGE',
  CRECK = 'CRECK',
  ROL = 'ROL',
  GST = 'GST',
  GMT = 'GMT',
}

export const mintAddressDevnet: Record<string, string> = {
  [SupportedCurrency.USDC]: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  [SupportedCurrency.SOL]: '11111111111111111111111111111111',
  [SupportedCurrency.USDT]: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
};

export const mintAddressMainnet: Record<string, string> = {
  [SupportedCurrency.USDC]: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  [SupportedCurrency.SOL]: '11111111111111111111111111111111',
  [SupportedCurrency.USDT]: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
  [SupportedCurrency.PUFF]: 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
  [SupportedCurrency.ALL]: '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj',
  [SupportedCurrency.FOXY]: 'FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq',
  [SupportedCurrency.FORGE]: 'FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds',
  [SupportedCurrency.CRECK]: 'Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY',
  [SupportedCurrency.ROL]: 'RoLLn5qBN4juQ1D2KFpJyAcC7Deo3cYotXi4qDooHLU',
  [SupportedCurrency.GST]: 'AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB',
  [SupportedCurrency.DUST]: 'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ',
  [SupportedCurrency.GMT]: '7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx',
};

export const currencies: Record<string, Currency> = {
  [SupportedCurrency.USDC]: {
    symbol: SupportedCurrency.USDC,
    name: 'USD Coin',
    mintAddress: mintAddressDevnet[SupportedCurrency.USDC],
    decimals: 6,
    coinMarketCapId: 3408,
  },
  [SupportedCurrency.SOL]: {
    symbol: SupportedCurrency.SOL,
    name: 'Solana',
    mintAddress: mintAddressDevnet[SupportedCurrency.SOL],
    decimals: 9,
    coinMarketCapId: 5426,
  },
  [SupportedCurrency.DUST]: {
    symbol: SupportedCurrency.DUST,
    name: 'DUST Protocol',
    mintAddress: mintAddressDevnet[SupportedCurrency.DUST],

    decimals: 9,
    coinMarketCapId: 18802,
  },
  [SupportedCurrency.USDT]: {
    symbol: SupportedCurrency.USDT,
    name: 'USD Tether',
    mintAddress: mintAddressDevnet[SupportedCurrency.USDT],
    decimals: 6,
    coinMarketCapId: 825,
  },
  [SupportedCurrency.PUFF]: {
    symbol: SupportedCurrency.PUFF,
    name: 'PUFF',
    mintAddress: mintAddressDevnet[SupportedCurrency.PUFF],
    decimals: 9,
    coinMarketCapId: 17429,
  },
  [SupportedCurrency.ALL]: {
    symbol: SupportedCurrency.ALL,
    name: 'ALL BLUE',
    mintAddress: mintAddressDevnet[SupportedCurrency.ALL],
    decimals: 9,
  },
  [SupportedCurrency.FOXY]: {
    symbol: SupportedCurrency.FOXY,
    name: 'Famous Foxes',
    mintAddress: mintAddressDevnet[SupportedCurrency.FOXY],
    decimals: 0,
  },
  [SupportedCurrency.FORGE]: {
    symbol: SupportedCurrency.FORGE,
    name: 'FORGE',
    mintAddress: mintAddressDevnet[SupportedCurrency.FORGE],
    decimals: 9,
  },
  [SupportedCurrency.CRECK]: {
    symbol: SupportedCurrency.CRECK,
    name: 'CRECK',
    mintAddress: mintAddressDevnet[SupportedCurrency.CRECK],
    decimals: 9,
  },
  [SupportedCurrency.ROL]: {
    symbol: SupportedCurrency.ROL,
    name: 'ROL',
    mintAddress: mintAddressDevnet[SupportedCurrency.ROL],
    decimals: 6,
  },
  [SupportedCurrency.GST]: {
    symbol: SupportedCurrency.GST,
    name: 'GST',
    mintAddress: mintAddressDevnet[SupportedCurrency.GST],
    decimals: 9,
    coinMarketCapId: 16352,
  },
  [SupportedCurrency.GMT]: {
    symbol: SupportedCurrency.GMT,
    name: 'GMT',
    mintAddress: mintAddressDevnet[SupportedCurrency.GMT],
    decimals: 9,
    coinMarketCapId: 18069,
  },
};

export const getMintAddress = (
  mintAddresses: Record<string, string>,
  symbol: string
): string => {
  const mintAddress = mintAddresses[symbol];
  if (mintAddress == null) {
    throw new Error(
      `The mint address of currency ${symbol} needs to be provided.`
    );
  }
  return mintAddress;
};

export const getMintAddressByCluster = (
  cluster: Cluster,
  symbol: string
): string => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return getMintAddress(mintAddressDevnet, symbol);
    case ClusterType.Mainnet:
      return getMintAddress(mintAddressMainnet, symbol);
    default:
      throw new Error(`The cluster ${cluster} is not supported.`);
  }
};
