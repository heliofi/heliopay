import { BlockchainEngineType } from '@heliofi/common';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import React from 'react';

import InstalledWallet from '../installedWallet';
import { useConnect } from '../../../../hooks/useConnect';
import { ConnectButtonProps } from '../../../../ui-kits/connectButton';

interface InstalledSolanaWalletProps extends ConnectButtonProps {
  installedWallets: Wallet[];
}

export const SolanaInstalledWallets = ({
  installedWallets,
}: InstalledSolanaWalletProps) => {
  const { select } = useWallet();
  const { setIsConnecting, blockchainEngineRef } = useConnect();

  const handleWalletClick = async (walletName: WalletName) => {
    select(walletName);
    setIsConnecting(true);
    blockchainEngineRef.current = BlockchainEngineType.SOL;
  };

  return (
    <>
      {installedWallets.map((wallet) => (
        <InstalledWallet
          key={wallet.adapter.name}
          name={wallet.adapter.name}
          icon={wallet.adapter.icon}
          handleWalletClick={() => handleWalletClick(wallet.adapter.name)}
        />
      ))}
    </>
  );
};
