import { BlockchainSymbol, Currency, CurrencyType } from '@heliofi/common';
import { HelioApiConnector } from '../model';

export class CurrencyService {
  private currencies!: Currency[];

  constructor(private apiService: HelioApiConnector) {}

  private setCurrencies(currencies: Currency[]) {
    this.currencies = currencies;
  }

  getCurrencyBySymbol(symbol: string): Currency | undefined {
    if (!this.hasCurrencyResult()) {
      throw new Error(`You should call currencyService.getCurrencies() before`);
    }

    const currency = this.currencies?.find(
      (currencyItem) => currencyItem.symbol === symbol
    );
    if (currency == null) {
      return undefined;
    }
    return currency;
  }

  getCurrencyByMint(mint: string): Currency | never {
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

  getCurrencyByMintOptional(mint: string): Currency | undefined {
    try {
      return this.getCurrencyByMint(mint);
    } catch (e) {
      return undefined;
    }
  }

  getCurrencyBySymbolAndBlockchain({
    symbol,
    blockchain,
  }: {
    symbol: string;
    blockchain?: BlockchainSymbol;
  }): Currency | undefined {
    if (!this.hasCurrencyResult()) {
      throw new Error(`You should call currencyService.getCurrencies() before`);
    }

    const currency = this.currencies?.find((curr) => {
      if (blockchain) {
        return curr.symbol === symbol && curr.blockchain?.symbol === blockchain;
      }
      return false;
    });

    return currency || this.currencies?.find((curr) => curr.symbol === symbol);
  }

  getCurrenciesByTypeAndBlockchain({
    type,
    blockchain,
  }: {
    type: CurrencyType;
    blockchain?: BlockchainSymbol;
  }): Currency[] {
    return this.currencies.filter(
      (currency) =>
        currency.type === type && currency?.blockchain?.symbol === blockchain
    );
  }

  async getCurrencies(): Promise<Currency[]> {
    const result = await this.apiService.getCurrencies();

    if (!this.hasCurrencyResult()) {
      this.setCurrencies(result);
    }

    return result;
  }

  private hasCurrencyResult(): boolean {
    return !!this.currencies?.length;
  }
}
