import { Cluster } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useState } from 'react';
import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const helioProviderValue = useMemo(
    () => ({
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
    }),
    [
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
    ]
  );

  return (
    <HelioContext.Provider value={helioProviderValue}>
      {children}
    </HelioContext.Provider>
  );
};
