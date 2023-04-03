import { Connection, PublicKey } from '@solana/web3.js';

export interface TokenBalanceInfo {
  mint: string;
  amount: number;
}

export async function getTokenBalances(
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
