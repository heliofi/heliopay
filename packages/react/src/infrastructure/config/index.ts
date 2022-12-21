import { Cluster } from '@solana/web3.js';
import { ClusterType } from '../../domain';

export const getHelioApiBaseUrl = (cluster: Cluster) => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return 'https://dev.api.hel.io/v1';
    case ClusterType.Mainnet:
      return 'https://api.hel.io/v1';
    default:
      return 'https://api.hel.io/v1';
  }
};

const DEV_ADDRESS_SERVICE_BASE_URL = 'https://dev.hel.io';
const PROD_ADDRESS_SERVICE_BASE_URL = 'https://hel.io';

export const getAddressApiBaseUrl = (cluster: Cluster) => {
  switch (cluster) {
    case ClusterType.Testnet:
    case ClusterType.Devnet:
      return DEV_ADDRESS_SERVICE_BASE_URL;
    case ClusterType.Mainnet:
      return PROD_ADDRESS_SERVICE_BASE_URL;
    default:
      return PROD_ADDRESS_SERVICE_BASE_URL;
  }
};
