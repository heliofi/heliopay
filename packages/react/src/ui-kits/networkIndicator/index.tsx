import { BlockchainSymbol } from '@heliofi/common';

import {
  StyledNetworkIndicatorContainer,
  StyledNetworkIndicatorText,
} from './styles';
import { Icon } from '../icon';

type NetworkIndicatorProps = {
  blockchain: BlockchainSymbol;
};

export const NetworkIndicator = ({ blockchain }: NetworkIndicatorProps) => {
  const getIconName = (): string | undefined => {
    switch (blockchain) {
      case BlockchainSymbol.POLYGON:
        return 'PolygonSM';
      case BlockchainSymbol.ETH:
        return 'EthSM';
      default:
        return 'SOLSM';
    }
  };
  const getConnectionName = (): string => {
    switch (blockchain) {
      case BlockchainSymbol.POLYGON:
        return 'Polygon network';
      case BlockchainSymbol.ETH:
        return 'Ethereum network';
      default:
        return 'Solana network';
    }
  };

  return (
    <StyledNetworkIndicatorContainer>
      <Icon className="network-icon" iconName={getIconName()} />
      <StyledNetworkIndicatorText>
        {getConnectionName()}
      </StyledNetworkIndicatorText>
    </StyledNetworkIndicatorContainer>
  );
};
