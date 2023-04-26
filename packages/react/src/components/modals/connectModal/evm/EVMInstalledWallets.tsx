import { BlockchainEngineType } from '@heliofi/common';
import React from 'react';
import { useAccount, useConnect as useMetamaskConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { isEVMInstalled } from '../utils';
import { useConnect } from '../../../../hooks/useConnect';
import InstalledWallet from '../installedWallet';

export const EVMInstalledWallets = () => {
  const { connectAsync: connectMetaMask, isLoading } = useMetamaskConnect({
    connector: new InjectedConnector({
      options: { name: 'Injected' },
    }),
  });

  const { isConnected } = useAccount();

  const { setIsConnecting, blockchainEngineRef } = useConnect();

  const handleMetaMaskClick = async () => {
    if (isEVMInstalled() && !isConnected && !isLoading) {
      await connectMetaMask();
    }
    setIsConnecting(true);
    blockchainEngineRef.current = BlockchainEngineType.EVM;
  };

  return (
    <InstalledWallet
      name="MetaMask"
      icon="https://helio-assets.s3.eu-west-1.amazonaws.com/MetaMask.png"
      handleWalletClick={handleMetaMaskClick}
    />
  );
};
