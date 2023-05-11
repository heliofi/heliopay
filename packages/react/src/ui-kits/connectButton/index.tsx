import React, { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { BlockchainEngineType, PaymentRequestType } from '@heliofi/common';
import { useConnect as useConnectWagmi } from 'wagmi';
import { ConnectButtonConnecting, StyledButton } from './styles';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { DeeplinkService } from '../../domain/services/DeeplinkService';
import { useConnect } from '../../hooks/useConnect';

export interface ConnectButtonProps {
  paymentRequestType?: PaymentRequestType;
  onError?: (err: unknown) => void;
}

export const ConnectButton: FC<ConnectButtonProps> = ({
  paymentRequestType,
  onError,
}) => {
  const { connecting } = useWallet();
  const { isLoading: connectingEVM } = useConnectWagmi();
  const { onConnect, setErrorHandler } = useConnect();

  const { getPaymentDetails } = useHelioProvider();

  const paymentDetails = getPaymentDetails();

  const blockchainEngine =
    paymentRequestType === PaymentRequestType.PAYLINK
      ? paymentDetails?.currency?.blockchain?.engine?.type
      : BlockchainEngineType.SOL;

  const connectOrRedirect = () => {
    if (paymentDetails) {
      if (
        blockchainEngine === BlockchainEngineType.EVM &&
        !DeeplinkService.isEthereumInjected()
      ) {
        window.location.href = DeeplinkService.getMetaMaskDeeplink();
      } else if (
        blockchainEngine === BlockchainEngineType.SOL &&
        !DeeplinkService.isSolanaInjected()
      ) {
        window.location.href = DeeplinkService.getPhantomDeeplink();
      }
    }

    onConnect({ blockchainEngine });
  };

  useEffect(() => {
    if (setErrorHandler) {
      setErrorHandler(onError);
    }
  }, [onError, setErrorHandler]);

  return (
    <StyledButton
      onClick={() => connectOrRedirect()}
      disabled={connecting || connectingEVM}
    >
      {connecting || connectingEVM ? (
        <ConnectButtonConnecting>
          <span>CONNECTING...</span>
        </ConnectButtonConnecting>
      ) : (
        <span>CONNECT WALLET</span>
      )}
    </StyledButton>
  );
};
