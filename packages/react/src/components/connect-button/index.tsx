import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC } from 'react';
import { StyledConnectButtonWrapper } from './styles';

export const ConnectButton: FC = () => {
  const { connecting } = useWallet();

  return (
    <StyledConnectButtonWrapper>
      {/* @ts-ignore TODO since we are using react v18 children don't exist on FC */}
      <WalletMultiButton startIcon={undefined}>
        {connecting ? (
          <span>CONNECTING...</span>
        ) : (
          <span className="rounded-full">CONNECT WALLET</span>
        )}
      </WalletMultiButton>
    </StyledConnectButtonWrapper>
  );
};

export default ConnectButton;
