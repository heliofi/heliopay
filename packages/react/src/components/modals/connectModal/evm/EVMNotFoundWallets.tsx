import React from 'react';

import WalletListItem from '../walletListItem';
import { InheritedModalProps } from '../../index';

type EVMNotFoundWalletsProps = InheritedModalProps;

export const EVMNotFoundWallets = ({ onHide }: EVMNotFoundWalletsProps) => {
  const handleNotFoundWalletClick = () => {
    window.open('https://metamask.io/download/', '_blank');
    onHide?.();
  };

  return (
    <div className="flex h-[32px] flex-row items-start justify-start">
      <WalletListItem
        walletName="MetaMask"
        icon="MetaMask"
        walletOnClick={handleNotFoundWalletClick}
      />
    </div>
  );
};
