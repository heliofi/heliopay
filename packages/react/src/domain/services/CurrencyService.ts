import { Currency, CurrencyType } from '@heliofi/common';
import { DefaultCurrencies } from '../constants/currency';

export class CurrencyService {
  private static currencies: Currency[];

  static amountToUSD(amount: number | string): string {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  static roundValue(amount: number | string, decimals: number): string {
    return parseFloat(String(amount)).toFixed(decimals);
  }

  static getCurrencySymbols(currencies: Currency[]): string[] {
    return currencies.map((currency) => currency.symbol);
  }

  static setPeggedCurrency(amount: string | number, currency: string): string {
    return (
      (CurrencyService.getCurrencyBySymbol(currency).symbolPrefix || '') +
      amount
    );
  }

  static setCurrencies(currencies: Currency[]) {
    CurrencyService.currencies = currencies;
  }

  static getCurrenciesByType(type: CurrencyType): Currency[] {
    return CurrencyService.currencies.filter(
      (currency) => currency.type === type
    );
  }

  static getCurrencyBySymbol(symbol: string): Currency {
    const currency = CurrencyService.currencies?.find(
      (currencyItem) => currencyItem.symbol === symbol
    );
    if (currency == null) {
      throw new Error(`Unable to find currency: ${currency}`);
    }
    return currency;
  }

  static getSplTokens(): string[] {
    return CurrencyService.getCurrenciesByType(CurrencyType.DIGITAL)
      .filter(
        (currency) => currency.symbol !== CurrencyService.getSolCurrencySymbol()
      )
      .map((currency) => currency.symbol);
  }

  static getDefaultCurrencySymbol(): string {
    return DefaultCurrencies.USDC;
  }

  static getDefaultCurrency(): Currency {
    return CurrencyService.getCurrencyBySymbol(
      CurrencyService.getDefaultCurrencySymbol()
    );
  }

  static getCurrenciesCount(): number {
    return CurrencyService.currencies.length;
  }

  static isSolPayment(symbol: string): boolean {
    return (
      CurrencyService.getCurrencyBySymbol(symbol).symbol ===
      CurrencyService.getSolCurrencySymbol()
    );
  }

  static getSolCurrencySymbol(): string {
    return DefaultCurrencies.SOL;
  }
}
