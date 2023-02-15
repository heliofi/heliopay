import { Currency } from '@heliofi/common';
import type { CurrencyService } from './CurrencyService';

export class TokenConversionService {
  // @TODO change to bigint
  constructor(private currencyService: CurrencyService) {}

  convertFromMinimalUnits(symbol: any, minimalAmount: number): number {
    try {
      const currencyMeta = this.currencyService.getCurrencyBySymbol(symbol);
      if (currencyMeta == null) {
        return 0;
      }
      return minimalAmount / 10 ** (currencyMeta.decimals as number);
    } catch (e) {
      return 0;
    }
  }

  // @TODO change to bigint
  convertToMinimalUnits(symbol?: any, actualAmount?: number): number {
    try {
      if (symbol == null || actualAmount == null) return 0;
      const currencyMeta = this.currencyService.getCurrencyBySymbol(symbol);
      if (currencyMeta == null) {
        return 0;
      }
      return Math.round(10 ** (currencyMeta.decimals as number) * actualAmount);
    } catch (e) {
      return 0;
    }
  }

  formatPrice(currency: Currency, normalizedAmount: number): string {
    return String(Math.round(normalizedAmount * 10000) / 10000);
  }

  convertFromMinimalAndRound(symbol: string, minimalAmount: number): string {
    const decimalAmount = this.convertFromMinimalUnits(symbol, minimalAmount);
    const currency = this.currencyService.getCurrencyBySymbol(symbol);

    if (currency) {
      return this.formatPrice(currency, decimalAmount);
    }
    throw new Error(`Unable to find currency: ${currency}`);
  }
}
