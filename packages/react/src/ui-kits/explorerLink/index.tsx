import { FC } from 'react';

import { useAccount } from 'wagmi';
import { BlockchainSymbol } from '@heliofi/common';
import { useCompositionRoot } from '../../hooks/compositionRoot';

interface Props {
  transaction?: string;
  title?: string;
  blockchain?: BlockchainSymbol;
}

const ExplorerLink: FC<Props> = ({ transaction, title, blockchain }) => {
  const { HelioSDK } = useCompositionRoot();

  const { isConnected } = useAccount();

  if (transaction == null) {
    return <span>Transaction is not available</span>;
  }

  let url;
  if (isConnected) {
    if (blockchain === BlockchainSymbol.POLYGON) {
      url =
        HelioSDK.polygonExplorerService.getPolygonExplorerTransactionURL(
          transaction
        );
    } else {
      url =
        HelioSDK.ethExplorerService.getEthereumExplorerTransactionURL(
          transaction
        );
    }
  } else {
    url =
      HelioSDK.solExplorerService.getSolanaExplorerTransactionURL(transaction);
  }
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {title ?? 'View details'}
    </a>
  );
};

export default ExplorerLink;
