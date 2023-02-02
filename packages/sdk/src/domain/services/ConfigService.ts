import { Cluster } from '@solana/web3.js';
import { ASSET_URL } from '../constants';
import { ClusterType } from '../model';

export class ConfigService {
  private cluster: Cluster | undefined;

  static DEV_HELIO_SERVICE_BASE_URL = 'https://dev.api.hel.io/v1';

  static PROD_HELIO_SERVICE_BASE_URL = 'https://api.hel.io/v1';

  constructor(cluster?: Cluster) {
    this.cluster = cluster;
  }

  getAssetUrl(): string {
    return ASSET_URL;
  }

  getCluster(): Cluster {
    if (!this.cluster) {
      throw new Error('Please set cluster before getCluster');
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
        return ConfigService.DEV_HELIO_SERVICE_BASE_URL;
      case ClusterType.Mainnet:
        return ConfigService.PROD_HELIO_SERVICE_BASE_URL;
      default:
        return ConfigService.PROD_HELIO_SERVICE_BASE_URL;
    }
  }
}
