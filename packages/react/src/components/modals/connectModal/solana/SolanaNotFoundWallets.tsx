import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import React from 'react';

import WalletListItem from '../walletListItem';
import { InheritedModalProps } from '../../index';

interface SolanaNotFoundWalletsProps extends InheritedModalProps {
  notFoundWallets: Wallet[];
}

export const SolanaNotFoundWallets = ({
  notFoundWallets,
  onHide,
}: SolanaNotFoundWalletsProps) => {
  const { select } = useWallet();

  const handleNotFoundWalletClick = (walletName: WalletName) => {
    select(walletName);
    onHide?.();
  };

  return (
    <>
      {notFoundWallets.map((wallet) => (
        <div
          key={wallet.adapter.name}
          className="flex h-[32px] flex-row items-start justify-start"
        >
          <WalletListItem
            walletName={wallet.adapter.name}
            icon={wallet.adapter.icon}
            walletOnClick={() => handleNotFoundWalletClick(wallet.adapter.name)}
          />
        </div>
      ))}
    </>
  );
};
