import { FC, ReactNode, useState } from 'react';
import { Cluster } from '../../domain';
import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [cluster, setCluster] = useState<Cluster>('devnet');
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
