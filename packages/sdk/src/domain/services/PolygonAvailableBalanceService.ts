import { BlockchainSymbol, CurrencyType } from '@heliofi/common';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { erc20 } from '@heliofi/evm-adapter';
import { TokenConversionService } from './TokenConversionService';
import { AvailableBalance } from '../model';
import { CurrencyService } from './CurrencyService';
import { EVMPublicKey } from '../model/blockchain';

export class PolygonAvailableBalanceService {
  constructor(
    private tokenConversionService: TokenConversionService,
    private currencyService: CurrencyService
  ) {}

  async getAvailableBalance(
    publicKey: EVMPublicKey | string
  ): Promise<AvailableBalance[]> {
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

        const decimalAmount =
          this.tokenConversionService.convertFromMinimalUnits(
            currency.symbol,
            balance.toBigInt(),
            BlockchainSymbol.POLYGON
          );

        return {
          value: decimalAmount,
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
  }
}
