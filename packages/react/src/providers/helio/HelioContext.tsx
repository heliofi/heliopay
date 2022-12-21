import { Cluster } from '@solana/web3.js';
import { createContext, useContext, useEffect } from 'react';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { useCompositionRoot } from '../../hooks/compositionRoot';

export const HelioContext = createContext<{
  currencyList: any[];
  setCurrencyList: (currencyList: any[]) => void;
  paymentDetails: any;
  setPaymentDetails: (paymentDetails: any) => void;
  cluster: Cluster | null;
  setCluster: (cluster: Cluster) => void;
  isCustomerDetailsRequired: boolean;
  setIsCustomerDetailsRequired: (isCustomerDetailsRequired: boolean) => void;
}>({
  currencyList: [],
  setCurrencyList: () => {},
  paymentDetails: null,
  setPaymentDetails: () => {},
  cluster: null,
  setCluster: () => {},
  isCustomerDetailsRequired: false,
  setIsCustomerDetailsRequired: () => {},
});

export const useHelioProvider = () => {
  const {
    currencyList,
    setCurrencyList,
    paymentDetails,
    setPaymentDetails,
    cluster,
    setCluster,
    isCustomerDetailsRequired,
    setIsCustomerDetailsRequired,
  } = useContext(HelioContext);

  const { apiService } = useCompositionRoot();

  const getCurrencyList = async () => {
    if (cluster) {
      const result = await apiService.listCurrencies(cluster);
      setCurrencyList(result || []);
      CurrencyService.setCurrencies(result);
    }
  };

  const checkCustomerDetailsRequired = () => {
    if (!paymentDetails) return false;
    return (
      paymentDetails.features?.requireEmail ||
      paymentDetails.features?.requireFullName ||
      paymentDetails.features?.requireDiscordUsername ||
      paymentDetails.features?.requireTwitterUsername ||
      paymentDetails.features?.requireCountry ||
      paymentDetails.features?.requireDeliveryAddress ||
      paymentDetails.features?.canChangeQuantity ||
      paymentDetails.features?.canChangePrice
    );
  };

  const getPaymentDetails = async (paymentRequestId: string) => {
    setPaymentDetails(null);
    if (!cluster) {
      throw new Error('Please provide a cluster');
    }
    const result = await apiService.getPaymentRequestByIdPublic(
      paymentRequestId,
      cluster
    );
    setPaymentDetails(result || {});
  };

  useEffect(() => {
    setIsCustomerDetailsRequired(checkCustomerDetailsRequired());
  }, [paymentDetails]);

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
    isCustomerDetailsRequired,
  };
};
