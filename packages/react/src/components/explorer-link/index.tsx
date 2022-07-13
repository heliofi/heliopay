import { FC } from 'react';
import { SolExplorerService } from '../../domain/services/SolExplorerService';
import { useHelioProvider } from '../../providers/helio/HelioContext';

interface Props {
  transaction?: string;
}

const ExplorerLink: FC<Props> = ({ transaction }) => {
  const { cluster } = useHelioProvider();
  if (transaction == null) {
    return <span>Transaction is not available</span>;
  }
  return (
    <a
      href={SolExplorerService.getSolanaExplorerTransactionURL(
        transaction,
        cluster
      )}
      target="_blank"
      rel="noreferrer"
    >
      View transaction
    </a>
  );
};

export default ExplorerLink;
