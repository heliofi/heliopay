import { DefaultCurrencies } from '../constants/currency';
import { Currency } from '../model';

export class CurrencyService {
  private static currencies: Currency[];

  static amountToUSD(amount: number | string): string {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  static roundValue(amount: number | string, decimals: number): string {
    return parseFloat(String(amount)).toFixed(decimals);
  }

  static setPeggedCurrency(amount: string | number, currency: string): string {
    return (CurrencyService.getCurrencyBySymbol(currency).sign || '') + amount;
  }

  static setCurrencies(currencies: Currency[]) {
    CurrencyService.currencies = currencies;
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
