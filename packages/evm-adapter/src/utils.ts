import { ChainId, ContractAddress } from './constants';

export const getContractAddress = (chainIdNr: number): string | undefined => {
  const chainId = chainIdNr as ChainId;
  if (!chainIdNr) {
    return undefined;
  }
  switch (chainId) {
    case ChainId.POLYGON_MUMBAI:
      return ContractAddress.POLYGON_MUMBAI;
    case ChainId.POLYGON_MAINNET:
      return ContractAddress.POLYGON_MAINNET;
  }
};
