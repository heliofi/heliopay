import {
  CurrencyService,
  getTokenBalances,
  TokenBalanceInfo,
  TokenConversionService,
} from '@heliofi/sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { AvailableBalance } from '../../../domain';

export const fetchAvailableBalances = async (
  publicKey: PublicKey,
  connection: Connection,
  tokenConversionService: TokenConversionService,
  currencyService: CurrencyService
): Promise<AvailableBalance[]> => {
  const solMinimalAmount = await connection.getBalance(publicKey);
  const solDecimalAmount = tokenConversionService.convertFromMinimalUnits(
    'SOL',
    BigInt(solMinimalAmount)
  );

  const solBalance: AvailableBalance = {
    tokenSymbol: 'SOL',
    value: solDecimalAmount,
  };

  const userTokens: TokenBalanceInfo[] = await getTokenBalances(
    publicKey,
    connection
  );

  const splTokenBalances: AvailableBalance[] = [];

  userTokens.forEach((token) => {
    const currency = currencyService.getCurrencyByMintOptional(token.mint);

    if (currency) {
      splTokenBalances.push({
        tokenSymbol: currency.symbol,
        value: token.amount,
      });
    }
  });

  return splTokenBalances.concat(solBalance);
};
