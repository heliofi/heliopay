import { Currency } from "@heliofi/common";
import type { HelioApiAdapter } from "../../infrastructure";

export class CurrencyService {
  private currencies!: Currency[];

  constructor(private apiService: HelioApiAdapter) {}

  setCurrencies(currencies: Currency[]) {
    this.currencies = currencies;
  }

  getCurrencyBySymbol(symbol: string): Currency {
    if (!this.hasCurrencyResult()) {
      throw new Error(`You should call currencyService.getCurrencies() before`);
    }

    const currency = this.currencies?.find(
      (currencyItem) => currencyItem.symbol === symbol
    );
    if (currency == null) {
      throw new Error(`Unable to find currency: ${currency}`);
    }
    return currency;
  }

  getCurrencyByMint(mint: string): Currency {
    if (!this.hasCurrencyResult()) {
      throw new Error(`You should call currencyService.getCurrencies() before`);
    }

    const foundCurrency = this.currencies.find(
      (currency) => currency.mintAddress === mint
    );
    if (foundCurrency == null) {
      throw new Error(`Unable to find currency by mint: ${mint}`);
    }
    return foundCurrency;
  }

  async getCurrencies(): Promise<Currency[]> {
    const result = await this.apiService.listCurrencies();

    if (!this.hasCurrencyResult()) {
      this.setCurrencies(result);
    }

    return result;
  }

  private hasCurrencyResult(): boolean {
    return !!this.currencies?.length;
  }
}
