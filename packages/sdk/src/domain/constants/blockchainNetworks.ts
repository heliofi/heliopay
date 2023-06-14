import { BlockchainSymbol } from '@heliofi/common';

type NetworkEnvironments = Record<
  BlockchainSymbol,
  { mainnet: string; devnet: string; testnet: string }
>;

export type Cluster =
  | 'devnet'
  | 'testnet'
  | 'mainnet-beta'
  | 'mainnet'
  | 'mumbai'
  | 'goerli';

export const BLOCKCHAIN_NETWORKS: NetworkEnvironments = {
  [BlockchainSymbol.SOL]: {
    mainnet: 'mainnet-beta',
    devnet: 'devnet',
    testnet: 'testnet',
  },
  [BlockchainSymbol.POLYGON]: {
    mainnet: 'mainnet',
    devnet: 'mumbai',
    testnet: 'mumbai',
  },
  [BlockchainSymbol.ETH]: {
    mainnet: 'mainnet',
    devnet: 'goerli',
    testnet: 'goerli',
  },
  [BlockchainSymbol.BITCOIN]: {
    mainnet: 'mainnet',
    devnet: 'testnet',
    testnet: 'testnet',
  },
} as const;
