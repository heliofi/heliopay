import { Cluster } from '@solana/web3.js';

export class SolExplorerService {
  static clusterToSolanaExplorer(
    cluster: Cluster
  ): string {
    if (cluster == 'mainnet-beta') {
      return 'mainnet';
    }
    return cluster ?? 'mainnet';
  }


  static getSolanaExplorerTransactionURL(
    transactionID: string,
    cluster: Cluster | null
  ): string {
    return `https://solscan.io/tx/${transactionID}?cluster=${SolExplorerService.clusterToSolanaExplorer(cluster)}`;
  }

  static getSolanaExplorerAddressURL(
    address: string,
    cluster: Cluster | null
  ): string {
    return `https://solscan.io/address/${address}?cluster=${SolExplorerService.clusterToSolanaExplorer(cluster)}`;
  }
}
