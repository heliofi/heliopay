import { TokenConversionService } from '@heliofi/sdk';
import { AvailableBalance, TokenSwapQuote } from '../model';

interface Props {
  tokenConversionService: TokenConversionService;
  availableBalances: AvailableBalance[];
  decimalAmount: number;
  currency?: string;
  canSwapTokens?: boolean;
  swapCurrency?: string;
  quantity?: number;
  interval?: number;
  tokenSwapQuote: TokenSwapQuote | null;
}

export class AvailableBalanceService {
  static getIsBalanceEnough({
    tokenConversionService,
    availableBalances,
    decimalAmount,
    currency,
    canSwapTokens,
    swapCurrency,
    quantity,
    interval,
    tokenSwapQuote,
  }: Props) {
    const isTokenSwapped = !!(canSwapTokens && swapCurrency);

    const swappedPrice =
      swapCurrency && tokenSwapQuote?.inAmount
        ? tokenConversionService.convertFromMinimalUnits(
            swapCurrency,
            BigInt(tokenSwapQuote?.inAmount)
          )
        : 0;

    const availableSolBalance =
      Number(
        availableBalances.find(
          (balance) =>
            balance.tokenSymbol === (isTokenSwapped ? swapCurrency : currency)
        )?.value
      ) || 0;

    return (
      availableSolBalance >=
      (isTokenSwapped
        ? swappedPrice
        : (quantity ?? 1) * (interval ?? 1) * decimalAmount)
    );
  }
}
