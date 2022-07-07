import { Cluster } from '@solana/web3.js';
import { createContext, useContext } from 'react';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';

export const HelioContext = createContext<{
  currencyList: any[];
  setCurrencyList: (currencyList: any[]) => void;
  paymentDetails: any;
  setPaymentDetails: (paymentDetails: any) => void;
  cluster: Cluster;
  setCluster: (cluster: Cluster) => void;
}>({
  currencyList: [],
  setCurrencyList: () => {},
  paymentDetails: null,
  setPaymentDetails: () => {},
  cluster: 'devnet',
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
    const result = await HelioApiAdapter.listCurrencies();
    setCurrencyList(result || []);
  };

  const getPaymentDetails = async (paymentRequestId: string) => {
    setPaymentDetails(null);
    const result = await HelioApiAdapter.getPaymentRequestByIdPublic(
      paymentRequestId,
      cluster
    );
    setPaymentDetails(result || {});
  };

  return {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    cluster,
    setCluster,
  };
};
