import { CurrencyService } from './CurrencyService';
import { Currency } from '../model';

export class TokenConversionService {
  // @TODO change to bigint
  static convertFromMinimalUnits(symbol: any, minimalAmount: number): number {
    try {
      const currencyMeta = CurrencyService.getCurrencyBySymbol(symbol);
      if (currencyMeta == null) {
        return 0;
      }
      return minimalAmount / 10 ** (currencyMeta.decimals as number); // @TODO fix
    } catch (e) {
      return 0;
    }
  }

  // @TODO change to bigint
  static convertToMinimalUnits(symbol?: any, actualAmount?: number): number {
    try {
      if (symbol == null || actualAmount == null) return 0;
      const currencyMeta = CurrencyService.getCurrencyBySymbol(symbol);
      if (currencyMeta == null) {
        return 0;
      }
      return Math.round(10 ** (currencyMeta.decimals as number) * actualAmount);
    } catch (e) {
      return 0;
    }
  }

  static formatPrice(currency: Currency, normalizedAmount: number): string {
    return String(Math.round(normalizedAmount * 10000) / 10000);
  }

  static convertFromMinimalAndRound(
    symbol: string,
    minimalAmount: number
  ): string {
    const decimalAmount = TokenConversionService.convertFromMinimalUnits(
      symbol,
      minimalAmount
    );
    return TokenConversionService.formatPrice(
      CurrencyService.getCurrencyBySymbol(symbol),
      decimalAmount
    );
  }
}
