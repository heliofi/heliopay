import { Cluster } from '@solana/web3.js';
import { ClusterType } from '../model';

export class SolExplorerService {
  static getSolanaExplorerTransactionURL(
    transactionID: string,
    cluster: Cluster | null
  ): string {
    return `https://solscan.io/tx/${transactionID}?cluster=${
      cluster === ClusterType.Mainnet ? 'mainnet' : cluster
    }`;
  }

  static getSolanaExplorerAddressURL(
    address: string,
    cluster: Cluster | null
  ): string {
    return `https://solscan.io/address/${address}?cluster=${
      cluster === ClusterType.Mainnet ? 'mainnet' : cluster
    }`;
  }
}
