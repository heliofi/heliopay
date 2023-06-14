import { WalletReadyState } from '@solana/wallet-adapter-base';
import { Wallet } from '@solana/wallet-adapter-react';

export function getSolanaWallets(wallets: Wallet[]): [Wallet[], Wallet[]] {
  const installed: Wallet[] = [];
  const notDetected: Wallet[] = [];
  const loadable: Wallet[] = [];

  wallets.forEach((wallet) => {
    if (wallet.readyState === WalletReadyState.NotDetected) {
      notDetected.push(wallet);
    } else if (wallet.readyState === WalletReadyState.Loadable) {
      loadable.push(wallet);
    } else if (wallet.readyState === WalletReadyState.Installed) {
      installed.push(wallet);
    }
  });

  return [installed, [...loadable, ...notDetected]];
}

export function isEVMInstalled(): boolean {
  return !!window.ethereum;
}
