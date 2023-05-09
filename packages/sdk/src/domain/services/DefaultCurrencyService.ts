import { BlockchainSymbol } from '@heliofi/common';

import { DefaultCurrencies } from '../constants/currency';

export class DefaultCurrencyService {
  getNativeCurrencyByBlockchainToSymbol(
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

  getSolCurrencySymbol(): string {
    return DefaultCurrencies.SOL;
  }

  getMaticCurrencySymbol(): string {
    return DefaultCurrencies.MATIC;
  }

  getEthCurrencySymbol(): string {
    return DefaultCurrencies.ETH;
  }

  getDefaultCurrencySymbol(): string {
    return DefaultCurrencies.USDC;
  }
}
