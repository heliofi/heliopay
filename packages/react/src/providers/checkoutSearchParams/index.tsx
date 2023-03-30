import React, { FC, ReactNode, useMemo, useState } from 'react';
import { CheckoutSearchParamsContext } from './CheckoutSearchParamsContext';
import { CheckoutSearchParamsValues } from '../../domain/services/CheckoutSearchParams';

const CheckoutSearchParamsProvider: FC<{
  children: ReactNode;
  searchCustomerDetails?: CheckoutSearchParamsValues;
}> = ({ children, searchCustomerDetails }) => {
  const [customerDetails, setCustomerDetails] = useState<
    CheckoutSearchParamsValues | undefined
  >(searchCustomerDetails);

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
