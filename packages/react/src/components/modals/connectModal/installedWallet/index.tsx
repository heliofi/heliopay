import React from 'react';

import { Button, Icon } from '../../../../ui-kits';
import WalletListItem from '../walletListItem';
import {
  StyledInstalledWalletsConnect,
  StyledInstalledWalletsWrapper,
  StyledInstalledWalletsTextWrapper,
  StyledInstalledWalletsText,
  StyledInstalledWalletsButtonWrapper,
} from './styles';

export interface InstalledWalletProps {
  name: string;
  icon: string;
  handleWalletClick: () => Promise<void>;
}

const InstalledWallet = ({
  name,
  icon,
  handleWalletClick,
}: InstalledWalletProps) => (
  <StyledInstalledWalletsWrapper key={name} onClick={handleWalletClick}>
    <WalletListItem walletName={name} icon={icon} />
    <StyledInstalledWalletsConnect>
      <StyledInstalledWalletsTextWrapper>
        <StyledInstalledWalletsText>Detected</StyledInstalledWalletsText>
      </StyledInstalledWalletsTextWrapper>
      <StyledInstalledWalletsButtonWrapper>
        <Button>
          <Icon iconName="ArrowRightCircle" />
        </Button>
      </StyledInstalledWalletsButtonWrapper>
    </StyledInstalledWalletsConnect>
  </StyledInstalledWalletsWrapper>
);

export default InstalledWallet;
