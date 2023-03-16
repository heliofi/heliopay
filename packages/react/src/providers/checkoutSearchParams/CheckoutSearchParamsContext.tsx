import { createContext, useContext, useEffect } from 'react';
import {
  CheckoutSearchParams,
  CheckoutSearchParamsValues,
} from '../../domain/services/CheckoutSearchParams';

export const CheckoutSearchParamsContext = createContext<{
  customerDetails: CheckoutSearchParamsValues;
  setCustomerDetails: (customerDetails: CheckoutSearchParamsValues) => void;
}>({
  customerDetails: {},
  setCustomerDetails: () => {},
});

export const useCheckoutSearchParamsProvider = () => {
  const { customerDetails, setCustomerDetails } = useContext(
    CheckoutSearchParamsContext
  );

  const queryString = window.location.href.split('?')[1];

  useEffect(() => {
    const checkoutSearchParams = new CheckoutSearchParams(queryString);
    setCustomerDetails(checkoutSearchParams.getParsedCheckoutSearchParams());
  }, [queryString]);

  return { customerDetails, setCustomerDetails };
};
