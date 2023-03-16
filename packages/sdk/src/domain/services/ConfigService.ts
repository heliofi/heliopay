import { Cluster } from '@solana/web3.js';

import { PaymentRequestType } from '@heliofi/common';
import { ClusterType } from '../model';
import { ASSET_URL } from '../constants';

export class ConfigService {
  private cluster?: Cluster;

  static DEV_HELIO_SERVICE_BASE_URL = 'https://dev.api.hel.io/v1';

  static PROD_HELIO_SERVICE_BASE_URL = 'https://api.hel.io/v1';

  static DEV_HELIO_BASE_URL = 'https://dev.hel.io';

  static PROD_HELIO_BASE_URL = 'https://www.hel.io';

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

  getHelioBaseUrl(): string {
    switch (this.cluster) {
      case ClusterType.Testnet:
      case ClusterType.Devnet:
        return ConfigService.DEV_HELIO_BASE_URL;
      case ClusterType.Mainnet:
        return ConfigService.PROD_HELIO_BASE_URL;
      default:
        return ConfigService.PROD_HELIO_BASE_URL;
    }
  }

  getPhantomLink(id: string, paymentType: PaymentRequestType): string {
    const baseUrl = this.getHelioBaseUrl();
    const urlParam = paymentType === PaymentRequestType.PAYLINK ? 'pay' : 's';
    return `https://phantom.app/ul/browse/${baseUrl}/${urlParam}/${id}?ref=${baseUrl}`;
  }
}
