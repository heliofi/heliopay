import { Cluster } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useState } from 'react';
import { Currency } from '@heliofi/common';
import { HelioContext } from './HelioContext';
import { TokenSwapQuote } from '../../domain';

export const HelioProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [isCustomerDetailsRequired, setIsCustomerDetailsRequired] =
    useState(false);
  const [tokenSwapLoading, setTokenSwapLoading] = useState(false);
  const [tokenSwapCurrencies, setTokenSwapCurrencies] = useState<
    Currency[] | null
  >(null);
  const [tokenSwapQuote, setTokenSwapQuote] = useState<TokenSwapQuote | null>(
    null
  );
  const [tokenSwapError, setTokenSwapError] = useState('');

  const helioProviderValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <HelioContext.Provider value={helioProviderValue}>
      {children}
    </HelioContext.Provider>
  );
};
