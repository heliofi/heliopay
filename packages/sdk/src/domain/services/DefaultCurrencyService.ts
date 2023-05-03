import { BlockchainSymbol, Currency } from '@heliofi/common';

import { CurrencyService } from './CurrencyService';
import { DefaultCurrencies } from '../constants/currency';
import { TokenConversionService } from './TokenConversionService';

export class DefaultCurrencyService {
  static getNativeCurrencyByBlockchainToSymbol(
    blockchain: string
  ): string | undefined {
    switch (blockchain) {
      case BlockchainSymbol.ETH:
        return DefaultCurrencies.ETH;
      case BlockchainSymbol.POLYGON:
        return DefaultCurrencies.MATIC;
      case BlockchainSymbol.SOL:
        return DefaultCurrencies.SOL;
      default:
        return DefaultCurrencies.USDC;
    }
  }

  static getSolCurrencySymbol(): string {
    return DefaultCurrencies.SOL;
  }

  static getMaticCurrencySymbol(): string {
    return DefaultCurrencies.MATIC;
  }

  static getEthCurrencySymbol(): string {
    return DefaultCurrencies.ETH;
  }

  static getDefaultCurrencySymbol(): string {
    return DefaultCurrencies.USDC;
  }
}
