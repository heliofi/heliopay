import { ContractAddresses } from './constants';

export const getContractAddress = (chainId: number): string | undefined => {
  switch (chainId) {
    case 80001:
      return ContractAddresses.POLYGON_MUMBAI;
    case 137:
      return ContractAddresses.POLYGON_MAINNET;
  }
};
