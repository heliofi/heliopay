import { ClusterHelio } from '../model';
import type { ConfigService } from './ConfigService';

export class SolExplorerService {
  constructor(private configService: ConfigService) {}

  getSolanaExplorerTransactionURL(transactionID: string): string {
    const cluster = this.configService.getCluster();
    return `https://solscan.io/tx/${transactionID}?cluster=${
      cluster === ClusterHelio.Mainnet ? 'mainnet' : cluster
    }`;
  }
}
