import { FC, ReactNode, useMemo, useState } from 'react';
import { Currency, PaymentRequestType } from '@heliofi/common';
import { ClusterHelioType, TokenSwapQuote } from '@heliofi/sdk';

import { HelioContext } from './HelioContext';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState<Currency | undefined>();
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [cluster, setCluster] = useState<ClusterHelioType | null>(null);
  const [isCustomerDetailsRequired, setIsCustomerDetailsRequired] =
    useState(false);
  const [tokenSwapLoading, setTokenSwapLoading] = useState(false);
  const [tokenSwapCurrencies, setTokenSwapCurrencies] = useState<
    Currency[] | null
  >(null);
  const [tokenSwapQuote, setTokenSwapQuote] =
    useState<TokenSwapQuote | undefined>(undefined);
  const [tokenSwapError, setTokenSwapError] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentRequestType>();

  const helioProviderValue = useMemo(
    () => ({
      activeCurrency,
      setActiveCurrency,
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
      isCustomerDetailsRequired,
      setIsCustomerDetailsRequired,
      tokenSwapLoading,
      setTokenSwapLoading,
      tokenSwapCurrencies,
      setTokenSwapCurrencies,
      tokenSwapQuote,
      setTokenSwapQuote,
      tokenSwapError,
      setTokenSwapError,
      paymentType,
      setPaymentType,
    }),
    [
      activeCurrency,
      setActiveCurrency,
      currencyList,
      setCurrencyList,
      paymentDetails,
      setPaymentDetails,
      cluster,
      setCluster,
      isCustomerDetailsRequired,
      setIsCustomerDetailsRequired,
      tokenSwapLoading,
      setTokenSwapLoading,
      tokenSwapCurrencies,
      setTokenSwapCurrencies,
      tokenSwapQuote,
      setTokenSwapQuote,
      tokenSwapError,
      setTokenSwapError,
      paymentType,
      setPaymentType,
    ]
  );

  return (
    <HelioContext.Provider value={helioProviderValue}>
      {children}
    </HelioContext.Provider>
  );
};
