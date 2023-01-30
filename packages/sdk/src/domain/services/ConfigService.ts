import { ASSET_URL } from "../constants";
import { ClusterType } from "../model";

const DEV_HELIO_SERVICE_BASE_URL = "https://dev.api.hel.io/v1";
const PROD_HELIO_SERVICE_BASE_URL = "https://api.hel.io/v1";

export class ConfigService {
  constructor(private cluster: ClusterType) {}

  getAssetUrl(): string {
    return ASSET_URL;
  }

  getCluster(): ClusterType {
    return this.cluster;
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
