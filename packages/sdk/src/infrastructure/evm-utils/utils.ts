import { BlockchainSymbol } from '@heliofi/common';
import { ChainId } from '@heliofi/evm-adapter';

import {
  BLOCKCHAIN_NETWORKS,
  Cluster,
} from '../../domain/constants/blockchainNetworks';

export const checkNetwork = (
  chainId: number,
  cluster?: Cluster,
  blockchain?: BlockchainSymbol
) => {
  let correctChainId;

  switch (blockchain) {
    case BlockchainSymbol.POLYGON:
      correctChainId =
        cluster === BLOCKCHAIN_NETWORKS[blockchain].mainnet
          ? ChainId.POLYGON_MAINNET
          : ChainId.POLYGON_MUMBAI;
      break;
    case BlockchainSymbol.ETH:
      correctChainId =
        cluster === BLOCKCHAIN_NETWORKS[blockchain].mainnet
          ? ChainId.ETHEREUM_MAINNET
          : ChainId.ETHEREUM_GOERLI;
      break;
    default:
      throw new Error('Wallet set to wrong network!');
  }

  if (chainId !== correctChainId) {
    throw new Error('Wallet set to wrong network!');
  }
};
