import { Cluster } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useState } from 'react';
import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [isCustomerDetailsRequired, setIsCustomerDetailsRequired] =
    useState(false);
  const helioProviderValue = useMemo(
    () => ({
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
      isCustomerDetailsRequired,
      setIsCustomerDetailsRequired,
    }),
    [
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
      isCustomerDetailsRequired,
      setIsCustomerDetailsRequired,
    ]
  );

  return (
    <HelioContext.Provider value={helioProviderValue}>
      {children}
    </HelioContext.Provider>
  );
};
