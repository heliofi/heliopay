import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import React from 'react';

import WalletListItem from '../walletListItem';
import { InheritedModalProps } from '../../index';
import { StyledWalletListItemWrapper } from './styles';

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
        <StyledWalletListItemWrapper key={wallet.adapter.name}>
          <WalletListItem
            walletName={wallet.adapter.name}
            icon={wallet.adapter.icon}
            walletOnClick={() => handleNotFoundWalletClick(wallet.adapter.name)}
          />
        </StyledWalletListItemWrapper>
      ))}
    </>
  );
};
