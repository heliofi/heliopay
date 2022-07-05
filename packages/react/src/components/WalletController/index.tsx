import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { shortenWalletAddress } from '../../utils';
import ArrowSwap from '../Icons/ArrowSwap';
import Exit from '../Icons/Exit';
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

  const items = [
    {
      label: 'Change wallet',
      action: () => {
        setVisible(true);
      },
      icon: <ArrowSwap />,
    },
    {
      label: 'Disconnect Wallet',
      action: () => {
        disconnect();
      },
      icon: <Exit />,
    },
  ];
  return (
    <StyledMenuWrapper>
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
