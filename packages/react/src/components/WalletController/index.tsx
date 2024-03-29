import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExitIcon, ArrowsDoubleIcon } from '@heliofi/helio-icons';
import { useDisconnect } from 'wagmi';

import { BlockchainEngineType, PaymentRequestType } from '@heliofi/common';
import useOnClickOutside from '../../hooks/useClickOutside';

import {
  StyledDropdownButton,
  StyledMenu,
  StyledMenuIcon,
  StyledMenuItem,
  StyledMenuLabel,
  StyledMenuWrapper,
  StyledWalletAddress,
} from './styles';
import { useConnect } from '../../hooks/useConnect';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { shortenWalletAddress } from '../../utils';

export interface WalletControllerProps {
  publicKey: string;
  paymentRequestType?: PaymentRequestType;
  onError?: (err: unknown) => void; // @todo-v check
}

const WalletController = ({
  paymentRequestType,
  onError,
  publicKey,
}: WalletControllerProps) => {
  const { disconnect } = useWallet();
  const { disconnect: disconnectEVM } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const { onConnect, setErrorHandler, blockchainEngineRef } = useConnect();
  const { getPaymentDetails } = useHelioProvider();

  const dropdownRef = useOnClickOutside(() => {
    setIsOpen(false);
  });

  const paymentDetails = getPaymentDetails();
  const blockchainEngine =
    paymentRequestType === PaymentRequestType.PAYLINK
      ? paymentDetails?.currency?.blockchain?.engine?.type
      : BlockchainEngineType.SOL;

  const items = [
    {
      label: 'Change wallet',
      action: () => {
        setIsOpen(false);
        onConnect({ blockchainEngine });
      },
      icon: <ArrowsDoubleIcon />,
    },
    {
      label: 'Disconnect Wallet',
      action: async () => {
        setIsOpen(false);
        await disconnect();
        await disconnectEVM();
        blockchainEngineRef.current = undefined;
      },
      icon: <ExitIcon />,
    },
  ];

  useEffect(() => {
    if (setErrorHandler) {
      setErrorHandler(onError);
    }
  }, [onError, setErrorHandler]);

  return (
    <StyledMenuWrapper ref={dropdownRef}>
      <StyledDropdownButton onClick={() => setIsOpen(!isOpen)}>
        Connected
        <StyledWalletAddress>
          {shortenWalletAddress(publicKey)}
        </StyledWalletAddress>
      </StyledDropdownButton>
      {isOpen && (
        <StyledMenu>
          {items.map(({ label, action, icon }) => (
            <StyledMenuItem key={label} onClick={action}>
              <StyledMenuIcon>{icon}</StyledMenuIcon>
              <StyledMenuLabel>{label}</StyledMenuLabel>
            </StyledMenuItem>
          ))}
        </StyledMenu>
      )}
    </StyledMenuWrapper>
  );
};

export default WalletController;
