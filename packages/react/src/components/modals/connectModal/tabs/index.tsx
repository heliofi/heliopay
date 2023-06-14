import { BlockchainEngineType } from '@heliofi/common';

import { Tab } from '../../../tabs';
import { Icon } from '../../../../ui-kits';
import { ConnectWalletDefaultIconType } from '../../../../infrastructure/theme/types';
import { StyledConnectTabItem } from './styles';

type ConnectWalletTabsProperties = {
  blockchainEngine?: BlockchainEngineType;
  activeTab?: BlockchainEngineType;
  inactiveIconType: ConnectWalletDefaultIconType;
};

export const getConnectWalletTabs = ({
  blockchainEngine,
  activeTab,
  inactiveIconType,
}: ConnectWalletTabsProperties): Tab[] => {
  const tabInfo = [
    {
      title: 'Solana',
      icon:
        inactiveIconType === ConnectWalletDefaultIconType.WITH_COLOR
          ? 'SOLWhite'
          : 'SOL',
      activeIcon:
        inactiveIconType === ConnectWalletDefaultIconType.WITH_COLOR
          ? 'SOL'
          : 'SOLWhite',
      id: BlockchainEngineType.SOL,
      disabled: blockchainEngine === BlockchainEngineType.EVM,
    },
    {
      title: 'Ethereum',
      icon:
        inactiveIconType === ConnectWalletDefaultIconType.WITH_COLOR
          ? 'ETHWhite'
          : 'ETH',
      activeIcon:
        inactiveIconType === ConnectWalletDefaultIconType.WITH_COLOR
          ? 'ETH'
          : 'ETHWhite',
      id: BlockchainEngineType.EVM,
      disabled: blockchainEngine === BlockchainEngineType.SOL,
    },
  ];

  return tabInfo.map(({ title, icon, activeIcon, id, disabled }) => ({
    title: (
      <StyledConnectTabItem>
        <Icon iconName={activeTab === id ? activeIcon : icon} />
        <span>{title}</span>
      </StyledConnectTabItem>
    ),
    id,
    disabled,
  }));
};
