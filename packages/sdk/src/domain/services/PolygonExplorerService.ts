import { GeneralNetwork } from '@heliofi/common';
import { ConfigService } from './ConfigService';

export class PolygonExplorerService {
  constructor(private configService: ConfigService) {}

  getPolygonExplorerUrlByCluster(): string {
    if (this.configService.getCluster() === GeneralNetwork.MAINNET) {
      return 'https://polygonscan.com';
    }
    return 'https://mumbai.polygonscan.com';
  }

  getPolygonExplorerTransactionURL(transactionID: string): string {
    return `${this.getPolygonExplorerUrlByCluster()}/tx/${transactionID}`;
  }

  getPolygonExplorerAddressURL(address: string): string {
    return `${this.getPolygonExplorerUrlByCluster()}/address/${address}`;
  }
}
