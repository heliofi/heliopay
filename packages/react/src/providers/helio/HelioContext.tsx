import { createContext, useContext } from 'react';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';

export const HelioContext = createContext<any | null>(null);

export const useHelioProvider = () => {
  const { currencyList, setCurrencyList, paymentDetails, setPaymentDetails } =
    useContext(HelioContext);

  const getCurrencyList = async () => {
    const result = await HelioApiAdapter.listCurrencies();
    setCurrencyList(result || []);
  };

  const getPaymentDetails = async (paymentRequestId: string) => {
    const result = await HelioApiAdapter.getPaymentRequestById(
      paymentRequestId
    );
    setPaymentDetails(result || {});
  };

  return { currencyList, paymentDetails, getCurrencyList, getPaymentDetails };
};
