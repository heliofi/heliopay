import React from 'react';

import { WalletName } from '@solana/wallet-adapter-base';

import {
  StyledWalletListItemWrapper,
  StyledWalletListItemIcon,
  StyledWalletListItemText,
} from './styles';

export type WalletListItemProps = {
  walletName: WalletName | string;
  icon: string;
  walletOnClick?: () => void;
};

const WalletListItem = ({
  icon,
  walletName,
  walletOnClick,
}: WalletListItemProps) => (
  <StyledWalletListItemWrapper onClick={walletOnClick}>
    <StyledWalletListItemIcon>
      <img src={icon} alt={walletName} />
    </StyledWalletListItemIcon>
    <StyledWalletListItemText>{walletName}</StyledWalletListItemText>
  </StyledWalletListItemWrapper>
);

export default WalletListItem;
