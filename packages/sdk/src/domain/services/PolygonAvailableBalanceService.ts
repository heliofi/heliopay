import { Connection, PublicKey } from '@solana/web3.js';

import { BlockchainSymbol, CurrencyType } from '@heliofi/common';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { erc20 } from '@heliofi/evm-adapter';
import { TokenConversionService } from './TokenConversionService';
import { AvailableBalance, TokenSwapQuote } from '../model';
import { CurrencyService } from './CurrencyService';

interface TokenBalanceInfo {
  mint: string;
  amount: number;
}

interface Props {
  decimalAmount: number;
  currency?: string;
  canSwapTokens?: boolean;
  swapCurrency?: string;
  quantity?: number;
  interval?: number;
  tokenSwapQuote: TokenSwapQuote | null;
}

export class PolygonAvailableBalanceService {
  availableBalances: AvailableBalance[] = [];

  constructor(
    private tokenConversionService: TokenConversionService,
    private currencyService: CurrencyService
  ) {}

  async fetchAvailableBalances(publicKey: PublicKey, connection: Connection) {
    const solMinimalAmount = await connection.getBalance(publicKey);
    const solDecimalAmount =
      this.tokenConversionService.convertFromMinimalUnits(
        'SOL',
        BigInt(solMinimalAmount)
      );

    const solBalance: AvailableBalance = {
      tokenSymbol: 'SOL',
      value: solDecimalAmount,
    };

    const userTokens: TokenBalanceInfo[] = await this.getTokenBalances(
      publicKey,
      connection
    );

    const splTokenBalances: AvailableBalance[] = [];

    userTokens.forEach((token) => {
      const currency = this.currencyService.getCurrencyByMintOptional(
        token.mint
      );

      if (currency) {
        splTokenBalances.push({
          tokenSymbol: currency.symbol,
          value: token.amount,
        });
      }
    });

    this.availableBalances = splTokenBalances.concat(solBalance);
  }

  isBalanceEnough({
    decimalAmount,
    currency,
    canSwapTokens,
    swapCurrency,
    quantity,
    interval,
    tokenSwapQuote,
  }: Props): boolean {
    const isTokenSwapped = !!(canSwapTokens && swapCurrency);

    const swappedPrice =
      swapCurrency && tokenSwapQuote?.inAmount
        ? this.tokenConversionService.convertFromMinimalUnits(
            swapCurrency,
            BigInt(tokenSwapQuote?.inAmount)
          )
        : 0;

    const availableSolBalance =
      Number(
        this.availableBalances.find(
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

  private async getTokenBalances(
    walletKey: PublicKey,
    connection: Connection
  ): Promise<Array<TokenBalanceInfo>> {
    try {
      const accounts = await connection.getParsedProgramAccounts(
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token program id
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                offset: 32, // number of bytes
                bytes: walletKey.toBase58(), // base58 encoded string
              },
            },
          ],
        }
      );
      const res: Array<TokenBalanceInfo> = [];
      for (const acc of accounts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const account = acc.account.data as any;
        res.push({
          mint: account.parsed.info.mint,
          amount: account.parsed.info.tokenAmount.uiAmount, // ui amount is decimal, while amount is u64 (deprecated?)
        });
      }
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }

  getAvailableBalances = async (
    publicKey: EVMPublicKey | string,
    currencies: Currency[]
  ): Promise<AvailableBalance[]> => {
    try {
      const tokenConversionService = new TokenConversionServiceV2(currencies);

      const localCurrencies =
        this.currencyService.getCurrenciesByTypeAndBlockchain({
          type: CurrencyType.DIGITAL,
          blockchain: BlockchainSymbol.POLYGON,
        });

      const provider = new Web3Provider(window.ethereum as ExternalProvider);

      const balancesSettledResult = await Promise.allSettled(
        localCurrencies.map(async (currency) => {
          const contract = new Contract(
            String(currency.mintAddress),
            erc20.abi,
            provider
          );
          const balance: BigNumber = await contract.balanceOf(publicKey);

          const decimalAmount = tokenConversionService.convertFromMinimalUnits({
            symbol: currency.symbol,
            minimalAmount: balance.toBigInt(),
            blockchain: BlockchainSymbol.POLYGON,
          });

          return {
            value: decimalAmount.toString(),
            tokenSymbol: currency.symbol,
          };
        })
      );

      return balancesSettledResult
        .filter(
          (item): item is PromiseFulfilledResult<AvailableBalance> =>
            item.status === 'fulfilled'
        )
        .map((item) => item.value);
    } catch (error) {
      throw Error('Cannot fetch available polygon balances');
    }
  };
}
