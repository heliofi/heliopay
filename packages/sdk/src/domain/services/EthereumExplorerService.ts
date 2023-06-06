import { GeneralNetwork } from '@heliofi/common';
import { ConfigService } from './ConfigService';

export class EthereumExplorerService {
  constructor(private configService: ConfigService) {}

  getEthereumExplorerUrlByCluster(): string {
    if (this.configService.getCluster() === GeneralNetwork.MAINNET) {
      return 'https://etherscan.io';
    }
    return 'https://goerli.etherscan.io';
  }

  getEthereumExplorerTransactionURL(transactionID: string): string {
    return `${this.getEthereumExplorerUrlByCluster()}/tx/${transactionID}`;
  }

  getEthereumExplorerAddressURL(address: string): string {
    return `${this.getEthereumExplorerUrlByCluster()}/address/${address}`;
  }
}
