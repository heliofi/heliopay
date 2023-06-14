import { BlockchainSymbol } from '@heliofi/common';
import { ChainId } from '@heliofi/evm-adapter';

import { BLOCKCHAIN_NETWORKS, ClusterHelioType } from '../../domain';

export const checkNetwork = (
  chainId: number,
  cluster?: ClusterHelioType,
  blockchain?: BlockchainSymbol
) => {
  let correctChainId;

  if (!cluster || !blockchain) {
    throw new Error('Wallet set to wrong network!');
  }

  const blockchainCluster = BLOCKCHAIN_NETWORKS[blockchain]?.[cluster];

  if (BlockchainSymbol.POLYGON === blockchain) {
    if (blockchainCluster === BLOCKCHAIN_NETWORKS[blockchain].mainnet) {
      correctChainId = ChainId.POLYGON_MAINNET;
    } else if (blockchainCluster === BLOCKCHAIN_NETWORKS[blockchain].devnet) {
      correctChainId = ChainId.POLYGON_MUMBAI;
    } else {
      throw new Error('Wallet set to wrong network!');
    }
  } else if (BlockchainSymbol.ETH === blockchain) {
    if (blockchainCluster === BLOCKCHAIN_NETWORKS[blockchain].mainnet) {
      correctChainId = ChainId.ETHEREUM_MAINNET;
    } else if (blockchainCluster === BLOCKCHAIN_NETWORKS[blockchain].devnet) {
      correctChainId = ChainId.ETHEREUM_GOERLI;
    } else {
      throw new Error('Wallet set to wrong network!');
    }
  } else {
    throw new Error('Wallet set to wrong network!');
  }

  if (chainId !== correctChainId) {
    throw new Error('Wallet set to wrong network!');
  }
};
