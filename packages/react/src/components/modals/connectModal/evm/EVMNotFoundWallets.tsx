import React from 'react';

import WalletListItem from '../walletListItem';
import { InheritedModalProps } from '../../index';
import { useCompositionRoot } from '../../../../hooks/compositionRoot';

type EVMNotFoundWalletsProps = InheritedModalProps;

export const EVMNotFoundWallets = ({ onHide }: EVMNotFoundWalletsProps) => {
  const { HelioSDK } = useCompositionRoot();

  const handleNotFoundWalletClick = () => {
    window.open('https://metamask.io/download/', '_blank');
    onHide?.();
  };

  return (
    <div className="flex h-[32px] flex-row items-start justify-start">
      <WalletListItem
        walletName="MetaMask"
        icon={`${HelioSDK.configService.getImageUrl('MetaMask')}`}
        walletOnClick={handleNotFoundWalletClick}
      />
    </div>
  );
};
