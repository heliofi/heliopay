import { createContext, useContext } from 'react';
import { CheckoutSearchParamsValues } from '../../domain/services/CheckoutSearchParams';

export const CheckoutSearchParamsContext = createContext<{
  customerDetails?: CheckoutSearchParamsValues;
  setCustomerDetails: (customerDetails: CheckoutSearchParamsValues) => void;
}>({
  customerDetails: {},
  setCustomerDetails: () => {},
});

export const useCheckoutSearchParamsProvider = () => {
  const { customerDetails, setCustomerDetails } = useContext(
    CheckoutSearchParamsContext
  );
  return { customerDetails, setCustomerDetails };
};
