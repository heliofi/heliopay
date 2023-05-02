import { BlockchainSymbol } from '@heliofi/common';
import { ChainId } from '@heliofi/evm-adapter';

export const chainIdToBlockchain = new Map<ChainId, BlockchainSymbol>([
  [ChainId.ETHEREUM_MAINNET, BlockchainSymbol.ETH],
  [ChainId.ETHEREUM_GOERLI, BlockchainSymbol.ETH],
  [ChainId.ETHEREUM_SEPOLIA, BlockchainSymbol.ETH],
  [ChainId.POLYGON_MAINNET, BlockchainSymbol.POLYGON],
  [ChainId.POLYGON_MUMBAI, BlockchainSymbol.POLYGON],
]);
