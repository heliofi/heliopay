import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

export const useEVMProvider = () => {
  const [evmProvider, setEVMProvider] = useState<Web3Provider | undefined>(
    undefined
  );

  useEffect(() => {
    if (window.ethereum != null) {
      setEVMProvider(
        new Web3Provider(window.ethereum as ExternalProvider, 'any')
      );
    }
  }, []);

  return evmProvider;
};
