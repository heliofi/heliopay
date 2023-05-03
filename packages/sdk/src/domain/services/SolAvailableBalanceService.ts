import { Connection, PublicKey } from '@solana/web3.js';

import { useConnection } from '@solana/wallet-adapter-react';
import { TokenConversionService } from './TokenConversionService';
import { AvailableBalance } from '../model';
import { CurrencyService } from './CurrencyService';

interface TokenBalanceInfo {
  mint: string;
  amount: number;
}

export class SolAvailableBalanceService {
  constructor(
    private tokenConversionService: TokenConversionService,
    private currencyService: CurrencyService
  ) {}

  async getAvailableBalance(publicKey: PublicKey): Promise<AvailableBalance[]> {
    const connectionProvider = useConnection();

    const solMinimalAmount = await connectionProvider.connection.getBalance(
      publicKey
    );
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
      connectionProvider.connection
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

    return splTokenBalances.concat(solBalance);
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
}
