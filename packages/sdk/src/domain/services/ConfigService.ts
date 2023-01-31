import { Cluster } from "@solana/web3.js";
import { ASSET_URL } from "../constants";
import { ClusterType } from "../model";

const DEV_HELIO_SERVICE_BASE_URL = "https://dev.api.hel.io/v1";
const PROD_HELIO_SERVICE_BASE_URL = "https://api.hel.io/v1";

export class ConfigService {
  private cluster: Cluster | undefined;

  constructor(cluster?: Cluster) {
    this.cluster = cluster;
  }

  getAssetUrl(): string {
    return ASSET_URL;
  }

  getCluster(): Cluster {
    if (!this.cluster) {
      throw new Error("Please set cluster before getCluster");
    }
    return this.cluster;
  }

  setCluster(cluster: Cluster) {
    this.cluster = cluster;
  }

  getHelioApiBaseUrl(): string {
    switch (this.cluster) {
      case ClusterType.Testnet:
      case ClusterType.Devnet:
        return DEV_HELIO_SERVICE_BASE_URL;
      case ClusterType.Mainnet:
        return PROD_HELIO_SERVICE_BASE_URL;
      default:
        return PROD_HELIO_SERVICE_BASE_URL;
    }
  }
}
