import { Cluster } from '@solana/web3.js';

const cluster = process.env.NEXT_PUBLIC_HELIO_SOL_CLUSTER;

export const getCluster = (): Cluster => {
  if (cluster == null) {
    throw new Error(
      'Please provide NEXT_PUBLIC_HELIO_SOL_CLUSTER as env variable'
    );
  }
  if (
    cluster !== 'devnet' &&
    cluster !== 'testnet' &&
    cluster !== 'mainnet-beta'
  ) {
    throw new Error('NEXT_PUBLIC_HELIO_SOL_CLUSTER must be of type Cluster');
  }
  return cluster;
};
