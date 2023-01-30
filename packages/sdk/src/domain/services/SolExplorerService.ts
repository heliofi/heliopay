import { Cluster } from "@solana/web3.js";
import { ClusterType } from "../model";
import type { ConfigService } from "./ConfigService";

export class SolExplorerService {
  constructor(private configService: ConfigService) {}

  getSolanaExplorerTransactionURL(
    transactionID: string,
    cluster: Cluster | null
  ): string {
    return `https://solscan.io/tx/${transactionID}?cluster=${
      this.configService.getCluster() === ClusterType.Mainnet
        ? "mainnet"
        : cluster
    }`;
  }
}
