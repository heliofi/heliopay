import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useEffect, useState } from 'react';

interface Props {
  onError?: (err: unknown) => void;
}

export const ConnectButton: FC<Props> = ({ onError }) => {
  const { publicKey } = useWallet();
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(!publicKey && isClicked);
  }, [publicKey, isClicked]);

  return (
    <label onClick={() => setIsClicked(true)}>
      <WalletMultiButton startIcon={undefined}>
        {loading ? (
          <>
            <span>CONNECTING...</span>
          </>
        ) : (
          <span className='rounded-full'>CONNECT WALLET</span>
        )}
      </WalletMultiButton>
    </label>
  );
};

export default ConnectButton;


