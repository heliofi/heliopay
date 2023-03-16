import React, { FC, ReactNode, useMemo, useState } from 'react';
import { CheckoutSearchParamsValues } from '../../domain/services/CheckoutSearchParams';
import { CheckoutSearchParamsContext } from './CheckoutSearchParamsContext';

const CheckoutSearchParamsProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [customerDetails, setCustomerDetails] =
    useState<CheckoutSearchParamsValues>({});

  const providerValue = useMemo(
    () => ({
      customerDetails,
      setCustomerDetails,
    }),
    [customerDetails, setCustomerDetails]
  );

  return (
    <CheckoutSearchParamsContext.Provider value={providerValue}>
      {children}
    </CheckoutSearchParamsContext.Provider>
  );
};

export default CheckoutSearchParamsProvider;
