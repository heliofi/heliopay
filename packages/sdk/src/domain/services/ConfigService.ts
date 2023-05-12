import { PaymentRequestType } from '@heliofi/common';
import { ClusterHelio, ClusterHelioType } from '../model';
import { ASSET_URL } from '../constants';

export class ConfigService {
  private cluster?: ClusterHelioType;

  static DEV_HELIO_SERVICE_BASE_URL = 'https://dev.api.hel.io/v1';

  static PROD_HELIO_SERVICE_BASE_URL = 'https://api.hel.io/v1';

  static DEV_HELIO_BASE_URL = 'https://dev.hel.io';

  static PROD_HELIO_BASE_URL = 'https://www.hel.io';

  constructor(cluster?: ClusterHelioType) {
    this.cluster = cluster;
  }

  getAssetUrl(): string {
    return ASSET_URL;
  }

  getImageUrl(name: string): string {
    switch (name) {
      case 'MetaMask':
      default:
        return `${ASSET_URL}/MetaMask.png`;
    }
  }

  getCluster(): ClusterHelioType {
    if (!this.cluster) {
      throw new Error('Please set cluster before getCluster');
    }
    return this.cluster;
  }

  setCluster(cluster: ClusterHelioType) {
    this.cluster = cluster;
  }

  getHelioApiBaseUrl(): string {
    switch (this.cluster) {
      case ClusterHelio.Testnet:
      case ClusterHelio.Devnet:
        return ConfigService.DEV_HELIO_SERVICE_BASE_URL;
      case ClusterHelio.Mainnet:
        return ConfigService.PROD_HELIO_SERVICE_BASE_URL;
      default:
        return ConfigService.PROD_HELIO_SERVICE_BASE_URL;
    }
  }

  getHelioBaseUrl(): string {
    switch (this.cluster) {
      case ClusterHelio.Testnet:
      case ClusterHelio.Devnet:
        return ConfigService.DEV_HELIO_BASE_URL;
      case ClusterHelio.Mainnet:
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
