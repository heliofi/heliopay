import { FC } from 'react';

import { useCompositionRoot } from '../../hooks/compositionRoot';

interface Props {
  transaction?: string;
  title?: string;
}

const ExplorerLink: FC<Props> = ({ transaction, title }) => {
  const { HelioSDK } = useCompositionRoot();

  if (transaction == null) {
    return <span>Transaction is not available</span>;
  }
  return (
    <a
      href={HelioSDK.solExplorerService.getSolanaExplorerTransactionURL(
        transaction
      )}
      target="_blank"
      rel="noreferrer"
    >
      {title ?? 'View details'}
    </a>
  );
};

export default ExplorerLink;
