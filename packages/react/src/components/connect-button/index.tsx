import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC } from 'react';
import { StyledConnectButtonWrapper } from './styles';

export const ConnectButton: FC = () => {
  const { connecting } = useWallet();

  return (
    <StyledConnectButtonWrapper>
      <WalletMultiButton
        startIcon={
          connecting ? (
            <span>CONNECTING...</span>
          ) : (
            <span className="rounded-full">CONNECT WALLET</span>
          )
        }
      />
    </StyledConnectButtonWrapper>
  );
};

export default ConnectButton;
