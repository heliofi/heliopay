import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExitIcon, ArrowsDoubleIcon } from '@heliofi/helio-icons';
import { useDisconnect } from 'wagmi';

import { BlockchainEngineType, PaymentRequestType } from '@heliofi/common';
import { shortenWalletAddress } from '../../utils';
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

export interface WalletControllerProps {
  paymentRequestType?: PaymentRequestType;
  onError?: (err: unknown) => void;
}

const WalletController = ({
  paymentRequestType,
  onError,
}: WalletControllerProps) => {
  const { disconnect, publicKey } = useWallet();
  const { disconnect: disconnectEVM } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const { onConnect, setErrorHandler } = useConnect();
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
          {shortenWalletAddress(String(publicKey))}
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
