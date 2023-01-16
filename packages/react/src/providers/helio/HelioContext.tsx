import { Cluster } from '@solana/web3.js';
import { createContext, useContext, useEffect } from 'react';
import { Currency, PaymentRequestType } from '@heliofi/common';
import jwtDecode from 'jwt-decode';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';
import { TokenSwapQuote } from '../../domain/model/TokenSwapQuote';
import { TokenConversionService } from '../../domain/services/TokenConversionService';

export const HelioContext = createContext<{
  currencyList: any[];
  setCurrencyList: (currencyList: any[]) => void;
  paymentDetails: any; // @TODO change type
  setPaymentDetails: (paymentDetails: any) => void;
  cluster: Cluster | null;
  setCluster: (cluster: Cluster) => void;
  isCustomerDetailsRequired: boolean;
  setIsCustomerDetailsRequired: (isCustomerDetailsRequired: boolean) => void;
  tokenSwapLoading: boolean;
  setTokenSwapLoading: (loading: boolean) => void;
  tokenSwapCurrencies: Currency[] | null;
  setTokenSwapCurrencies: (tokenSwapCurrencies: Currency[]) => void;
  tokenSwapQuote: TokenSwapQuote | null;
  setTokenSwapQuote: (tokenSwapQuote: TokenSwapQuote) => void;
  tokenSwapError: string;
  setTokenSwapError: (error: string) => void;
}>({
  currencyList: [],
  setCurrencyList: () => {},
  paymentDetails: null,
  setPaymentDetails: () => {},
  cluster: null,
  setCluster: () => {},
  isCustomerDetailsRequired: false,
  setIsCustomerDetailsRequired: () => {},
  tokenSwapLoading: false,
  setTokenSwapLoading: () => {},
  tokenSwapCurrencies: null,
  setTokenSwapCurrencies: () => {},
  tokenSwapQuote: null,
  setTokenSwapQuote: () => {},
  tokenSwapError: '',
  setTokenSwapError: () => {},
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
    tokenSwapLoading,
    setTokenSwapLoading,
    tokenSwapCurrencies,
    setTokenSwapCurrencies,
    tokenSwapQuote,
    setTokenSwapQuote,
    tokenSwapError,
    setTokenSwapError,
  } = useContext(HelioContext);

  const getCurrencyList = async () => {
    if (cluster) {
      const result = await HelioApiAdapter.listCurrencies(cluster);
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
      paymentDetails.features?.canChangeQuantity || // @TODO remove
      paymentDetails.features?.canChangePrice
    );
  };

  const getPaymentDetails = async (paymentRequestId: string) => {
    setPaymentDetails(null);
    if (!cluster) {
      throw new Error('Please provide a cluster');
    }
    const result = await HelioApiAdapter.getPaymentRequestByIdPublic(
      paymentRequestId,
      cluster
    );
    setPaymentDetails(result || {});
  };

  const initCluster = (initialCluster: Cluster) => {
    setCluster(initialCluster);
  };

  const getTokenSwapCurrencies = async () => {
    setTokenSwapLoading(true);

    const mintAddress: string | undefined =
      paymentDetails?.currency?.mintAddress;

    const SOL_MINT = '11111111111111111111111111111111';
    const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';

    // @TODO replace with SOL_MINT and WRAPPED_SOL_MINT from heliofi/common
    const validatedMintAddress =
      mintAddress === SOL_MINT ? WRAPPED_SOL_MINT : mintAddress;

    if (validatedMintAddress && cluster) {
      const mintAddresses = await HelioApiAdapter.getTokenSwapMintAddresses(
        validatedMintAddress,
        cluster
      );

      const currencies = mintAddresses.map((address) =>
        CurrencyService.getCurrencyByMint(address)
      );

      const solanaCurrency = CurrencyService.getCurrencyBySymbol('SOL');
      const bonkCurrency = CurrencyService.getCurrencyBySymbol('BONK');

      currencies.unshift(solanaCurrency);

      if (mintAddress !== bonkCurrency.mintAddress) {
        currencies.push(bonkCurrency);
      }

      setTokenSwapCurrencies(currencies as unknown as Currency[]);
    }
    setTokenSwapLoading(false);
  };

  const removeTokenSwapError = () => {
    setTokenSwapError('');
  };

  const getTokenSwapQuote = async (
    paymentRequestId: string,
    paymentRequestType: PaymentRequestType,
    fromMint: string,
    quantity: number,
    normalizedPrice: number,
    toMint?: string
  ) => {
    setTokenSwapLoading(true);
    try {
      if (cluster) {
        const tokenSwapJWTResponse = await HelioApiAdapter.getTokenSwapQuote(
          cluster,
          paymentRequestId,
          paymentRequestType,
          fromMint,
          quantity ?? 1,
          TokenConversionService.convertToMinimalUnits(
            paymentDetails.currency.symbol,
            normalizedPrice
          ),
          toMint
        );

        const decodedToken: {
          prid: string;
          route: string;
          from: string;
          to: string;
        } = jwtDecode(tokenSwapJWTResponse.routeToken);
        const quote = JSON.parse(decodedToken.route);

        setTokenSwapQuote({
          paymentRequestId: decodedToken.prid,
          routeTokenString: tokenSwapJWTResponse.routeToken,
          from: CurrencyService.getCurrencyByMint(decodedToken.from),
          to: CurrencyService.getCurrencyByMint(decodedToken.to),
          slippageBps: quote.slippageBps,
          priceImpactPct: quote.priceImpactPct,
          inAmount: quote.inAmount,
          outAmount: quote.outAmount,
          amount: quote.amount,
        });
        removeTokenSwapError();
      }
    } catch (e) {
      setTokenSwapError(String(e));
    } finally {
      setTokenSwapLoading(false);
    }
  };

  useEffect(() => {
    setIsCustomerDetailsRequired(checkCustomerDetailsRequired());
  }, [paymentDetails]);

  return {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    cluster,
    initCluster,
    isCustomerDetailsRequired,
    tokenSwapLoading,
    tokenSwapCurrencies,
    getTokenSwapCurrencies,
    tokenSwapQuote,
    tokenSwapError,
    getTokenSwapQuote,
    removeTokenSwapError,
  };
};
