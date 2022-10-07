import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const getClusterEndpoint = (network: string): string => {
  switch (network) {
    case WalletAdapterNetwork.Mainnet:
      return 'https://wiser-fittest-river.solana-mainnet.quiknode.pro/';
    default:
      return 'https://evocative-light-card.solana-devnet.quiknode.pro/';
  }
};
