import React, { FC, useEffect, useMemo, useState } from 'react';
import { BlockchainEngineType } from '@heliofi/common';

import { useWallet } from '@solana/wallet-adapter-react';

import { EVMInstalledWallets, EVMNotFoundWallets } from './evm';
import { SolanaNotFoundWallets } from './solana';
import Tabs, { Tab } from '../../tabs';
import { Icon } from '../../../ui-kits';
import { getConnectWalletTabs } from './tabs';
import { ConnectWalletDefaultIconType } from '../../../infrastructure/theme/types';
import { getSolanaWallets, isEVMInstalled } from './utils';
import { SolanaInstalledWallets } from './solana/SolanaInstalledWallets';
import Modal from '../index';
import {
  StyledConnectModalMoreOptions,
  StyledConnectModalSolanaInstalled,
  StyledConnectModalTabs,
  StyledConnectModalTitle,
  StyledConnectModalWrapper,
  StyledConnectModalMoreOptionsBody,
  StyledConnectModalMoreOptionsBodyIcon,
  StyledConnectModalMoreOptionsList,
} from './styles';

interface ConnectModalProps {
  onHide: () => void;
  isModalShown: boolean;
  blockchainEngine?: BlockchainEngineType;
}

export const ConnectModal: FC<ConnectModalProps> = ({
  onHide,
  isModalShown,
  blockchainEngine,
}) => {
  const { wallets } = useWallet();
  const inactiveIconType = ConnectWalletDefaultIconType.WHITE;

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [connectTabs, setConnectTabs] = useState(
    getConnectWalletTabs({
      blockchainEngine,
      inactiveIconType,
    })
  );

  const [activeTab, setActiveTab] = useState(
    connectTabs.find((tab) => !tab.disabled)?.id
  );

  const [installedWallets, otherWallets] = useMemo(
    () => getSolanaWallets(wallets),
    [wallets]
  );

  useEffect(() => {
    if (blockchainEngine) {
      setActiveTab(blockchainEngine);
    }
  }, [blockchainEngine]);

  useEffect(() => {
    if (
      activeTab === BlockchainEngineType.SOL ||
      activeTab === BlockchainEngineType.EVM
    ) {
      setConnectTabs(
        getConnectWalletTabs({
          activeTab,
          blockchainEngine,
          inactiveIconType,
        })
      );
    }
  }, [activeTab, blockchainEngine, inactiveIconType]);

  return isModalShown ? (
    <Modal onHide={onHide} icon={<Icon iconName="Helio" />}>
      <StyledConnectModalWrapper>
        <StyledConnectModalTitle>
          {installedWallets.length
            ? 'Connect a wallet to continue'
            : "You'll need a wallet to continue"}
        </StyledConnectModalTitle>
        <StyledConnectModalTabs>
          <Tabs
            activeTab={connectTabs.find((tab) => tab.id === activeTab)}
            tabs={connectTabs}
            onTabChange={(tab: Tab) => {
              setActiveTab(tab.id as BlockchainEngineType);
            }}
          />
        </StyledConnectModalTabs>
        {activeTab === BlockchainEngineType.SOL && installedWallets.length && (
          <StyledConnectModalSolanaInstalled>
            <SolanaInstalledWallets installedWallets={installedWallets} />
          </StyledConnectModalSolanaInstalled>
        )}
        {activeTab === BlockchainEngineType.EVM && isEVMInstalled() && (
          <EVMInstalledWallets />
        )}
        {(activeTab === BlockchainEngineType.SOL ||
          (activeTab === BlockchainEngineType.EVM && !isEVMInstalled())) && (
          <StyledConnectModalMoreOptions
            onClick={() => setShowMoreOptions((prev) => !prev)}
          >
            <StyledConnectModalMoreOptionsBody>
              <p>{showMoreOptions ? 'Hide options' : 'Show more options'}</p>
              <StyledConnectModalMoreOptionsBodyIcon>
                <Icon
                  iconName={`${showMoreOptions ? 'ArrowUp' : 'ArrowDown'}`}
                />
              </StyledConnectModalMoreOptionsBodyIcon>
            </StyledConnectModalMoreOptionsBody>
          </StyledConnectModalMoreOptions>
        )}
        <StyledConnectModalMoreOptionsList>
          {showMoreOptions && (
            <div>
              {activeTab === BlockchainEngineType.SOL ? (
                <SolanaNotFoundWallets notFoundWallets={otherWallets} />
              ) : (
                <EVMNotFoundWallets onHide={onHide} />
              )}
            </div>
          )}
        </StyledConnectModalMoreOptionsList>
      </StyledConnectModalWrapper>
    </Modal>
  ) : null;
};
