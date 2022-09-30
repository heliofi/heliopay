import { Cluster } from '@solana/web3.js';
import { createContext, useContext } from 'react';
import { Currency } from '../../domain';
import { PaymentRequestPublic } from '../../domain/model/PaymentRequestPublic';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';

export const HelioContext = createContext<{
  currencyList: Currency[] | [];
  setCurrencyList: (currencyList: any[]) => void;
  paymentDetails: PaymentRequestPublic | null;
  setPaymentDetails: (paymentDetails: PaymentRequestPublic | null) => void;
  cluster: Cluster | null;
  setCluster: (cluster: Cluster) => void;
}>({
  currencyList: [],
  setCurrencyList: () => {},
  paymentDetails: null,
  setPaymentDetails: () => {},
  cluster: null,
  setCluster: () => {},
});

export const useHelioProvider = () => {
  const {
    currencyList,
    setCurrencyList,
    paymentDetails,
    setPaymentDetails,
    cluster,
    setCluster,
  } = useContext(HelioContext);

  const getCurrencyList = async () => {
    if (cluster) {
      const result = await HelioApiAdapter.listCurrencies();
      setCurrencyList(result || []);
      CurrencyService.setCurrencies(result);
    }
  };

  const getPaymentDetails = async (paymentRequestId: string) => {
    setPaymentDetails(null);
    if (!cluster) {
      throw new Error('Please provide a cluster');
    }
    const result = await HelioApiAdapter.getPaymentRequestByIdPublic(
      paymentRequestId
    );
    setPaymentDetails(result || {});
  };

  const initCluster = (initialCluster: Cluster) => {
    setCluster(initialCluster);
  };

  return {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    cluster,
    initCluster,
  };
};
