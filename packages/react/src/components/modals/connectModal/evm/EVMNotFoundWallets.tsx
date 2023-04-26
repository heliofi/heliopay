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
        icon="https://helio-assets.s3.eu-west-1.amazonaws.com/MetaMask.png"
        walletOnClick={handleNotFoundWalletClick}
      />
    </div>
  );
};
