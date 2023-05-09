import { PublicKey } from '@solana/web3.js';
import { BlockchainSymbol } from '@heliofi/common';
import { TokenConversionService } from './TokenConversionService';
import { TokenSwapQuote } from '../model';
import { CurrencyService } from './CurrencyService';
import { SolAvailableBalanceService } from './SolAvailableBalanceService';
import { PolygonAvailableBalanceService } from './PolygonAvailableBalanceService';
import { EVMPublicKey } from '../model/blockchain';
import { EthereumAvailableBalanceService } from './EthereumAvailableBalanceService';

export interface AvailableBalanceServiceProps {
  decimalAmount: number;
  currency?: string;
  canSwapTokens?: boolean;
  swapCurrency?: string;
  quantity?: number;
  tokenSwapQuote?: TokenSwapQuote;
}

// @todo-v eth
export class AvailableBalanceService {
  availableBalance: number = 0;

  swappedPrice: number = 0;

  constructor(
    private tokenConversionService: TokenConversionService,
    private currencyService: CurrencyService,
    private solAvailableBalanceService: SolAvailableBalanceService,
    private polygonAvailableBalanceService: PolygonAvailableBalanceService,
    private ethAvailableBalanceService: EthereumAvailableBalanceService
  ) {}

  async fetchAvailableBalance({
    publicKey,
    evmPublicKey,
    blockchain,
    areCurrenciesDefined,
    currency,
    canSwapTokens,
    swapCurrency,
    tokenSwapQuote,
  }: {
    publicKey?: PublicKey;
    evmPublicKey?: EVMPublicKey;
    decimalAmount: number;
    currency?: string;
    canSwapTokens?: boolean;
    swapCurrency?: string;
    quantity?: number;
    tokenSwapQuote?: TokenSwapQuote;
    blockchain?: BlockchainSymbol;
    areCurrenciesDefined: boolean;
  }): Promise<void> {
    let availableBalance = 0;
    const isTokenSwapped = !!(canSwapTokens && swapCurrency);

    if (
      evmPublicKey &&
      blockchain === BlockchainSymbol.POLYGON &&
      areCurrenciesDefined
    ) {
      const polygonAvailableBalances =
        await this.polygonAvailableBalanceService.getAvailableBalance(
          evmPublicKey
        );
      availableBalance =
        polygonAvailableBalances?.find(
          (balance) => balance.tokenSymbol === currency
        )?.value || 0;
    } else if (
      evmPublicKey &&
      blockchain === BlockchainSymbol.ETH &&
      areCurrenciesDefined
    ) {
      const ethAvailableBalances =
        await this.ethAvailableBalanceService.getAvailableBalance(evmPublicKey);
      availableBalance =
        ethAvailableBalances?.find(
          (balance) => balance.tokenSymbol === currency
        )?.value || 0;
    } else if (publicKey && areCurrenciesDefined) {
      const solAvailableBalances =
        await this.solAvailableBalanceService.getAvailableBalance(publicKey);
      availableBalance =
        solAvailableBalances?.find(
          (balance) =>
            balance.tokenSymbol === (isTokenSwapped ? swapCurrency : currency)
        )?.value || 0;
    }

    const swappedPrice =
      swapCurrency && tokenSwapQuote?.inAmount
        ? this.tokenConversionService.convertFromMinimalUnits(
            swapCurrency,
            BigInt(tokenSwapQuote?.inAmount),
            blockchain
          )
        : 0;

    this.availableBalance = availableBalance;
    this.swappedPrice = swappedPrice;
  }

  isBalanceEnough({
    quantity,
    decimalAmount,
    isTokenSwapped,
  }: {
    isTokenSwapped: boolean;
    quantity?: number;
    decimalAmount: number;
  }): boolean {
    return (
      this.availableBalance >=
      (isTokenSwapped ? this.swappedPrice : (quantity ?? 1) * decimalAmount)
    );
  }
}
