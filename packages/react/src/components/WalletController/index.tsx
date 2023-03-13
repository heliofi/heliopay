import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ExitIcon, ArrowsDoubleIcon } from '@heliofi/helio-icons';

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

const WalletController = () => {
  const { setVisible } = useWalletModal();
  const { disconnect, publicKey } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useOnClickOutside(() => {
    setIsOpen(false);
  });

  const items = [
    {
      label: 'Change wallet',
      action: () => {
        setIsOpen(false);
        setVisible(true);
      },
      icon: <ArrowsDoubleIcon />,
    },
    {
      label: 'Disconnect Wallet',
      action: () => {
        setIsOpen(false);
        disconnect();
      },
      icon: <ExitIcon />,
    },
  ];

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
