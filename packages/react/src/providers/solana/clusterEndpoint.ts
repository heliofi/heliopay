import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const getClusterEndpoint = (network: string): string => {
  switch (network) {
    case WalletAdapterNetwork.Mainnet:
      return 'https://ssc-dao.genesysgo.net/';
    default:
      return 'https://devnet.genesysgo.net/';
  }
};
