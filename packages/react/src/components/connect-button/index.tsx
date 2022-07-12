import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useEffect, useState } from 'react';
import { StyledConnectButtonWrapper } from './styles';

export const ConnectButton: FC = () => {
  const { connecting } = useWallet();

  return (
    <StyledConnectButtonWrapper>
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
