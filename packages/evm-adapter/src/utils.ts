import { contractAddresses } from './constants';

export const getContractAddress = (chainId: number): string | undefined => {
  switch (chainId) {
    case 80001:
      return contractAddresses.POLYGON_MUMBAI;
    case 137:
      return contractAddresses.POLYGON_MAINNET;
  }
};
