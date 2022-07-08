import { Cluster } from '@solana/web3.js';
import { FC, ReactNode, useState } from 'react';
import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  return (
    <HelioContext.Provider
      value={{
        currencyList,
        setCurrencyList,
        paymentDetails,
        setPaymentDetails,
        cluster,
        setCluster,
      }}
    >
      {children}
    </HelioContext.Provider>
  );
};
