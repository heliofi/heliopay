import { FC, ReactNode, useState } from 'react';
import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  return (
    <HelioContext.Provider
      value={{
        currencyList,
        setCurrencyList,
        paymentDetails,
        setPaymentDetails,
      }}
    >
      {children}
    </HelioContext.Provider>
  );
};
