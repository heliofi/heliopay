import { Cluster } from '@solana/web3.js';

export class SolExplorerService {
  static getSolanaExplorerTransactionURL(transactionID: string, cluster: Cluster): string {
    return `https://solscan.io/tx/${transactionID}?cluster=${cluster}`;
  }

  static getSolanaExplorerAddressURL(address: string, cluster: Cluster): string {
    return `https://solscan.io/address/${address}?cluster=${cluster}`;
  }
}
