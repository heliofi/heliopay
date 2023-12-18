import { Cluster } from '@solana/web3.js';
import { createContext, useContext, useEffect } from 'react';
import {
  Currency,
  LinkFeaturesDto,
  Paylink,
  PaymentRequest,
  PaymentRequestFeatures,
  PaymentRequestType,
  Paystream,
  SOL_MINT,
  WRAPPED_SOL_MINT,
} from '@heliofi/common';
import jwtDecode from 'jwt-decode';

import { TokenSwapQuote } from '@heliofi/sdk';
import { useCompositionRoot } from '../../hooks/compositionRoot';

export type PaymentDetailsType = Paylink | Paystream;
export type PaymentFeatures = PaymentRequestFeatures | LinkFeaturesDto;

export const HelioContext = createContext<{
  currencyList: Currency[];
  setCurrencyList: (currencyList: Currency[]) => void;
  paymentDetails?: PaymentRequest;
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
  paymentType?: PaymentRequestType;
  setPaymentType: (requestType: PaymentRequestType) => void;
}>({
  currencyList: [],
  setCurrencyList: () => {},
  paymentDetails: undefined,
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
  paymentType: undefined,
  setPaymentType: () => {},
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
    paymentType,
    setPaymentType,
  } = useContext(HelioContext);

  const { HelioSDK } = useCompositionRoot();

  const getCurrencyList = async () => {
    if (cluster) {
      const result = await HelioSDK.currencyService.getCurrencies();
      setCurrencyList(result || []);
    }
  };

  const getPaymentDetails = <T extends PaymentDetailsType>(): T =>
    paymentDetails as T;

  const getPaymentFeatures = <T extends PaymentFeatures>(): T =>
    getPaymentDetails()?.features as T;

  const checkCustomerDetailsRequired = (): boolean => {
    if (!paymentDetails) return false;

    return !!(
      getPaymentFeatures()?.requireEmail ||
      getPaymentFeatures()?.requireFullName ||
      getPaymentFeatures()?.requireDiscordUsername ||
      getPaymentFeatures()?.requireTwitterUsername ||
      getPaymentFeatures()?.requireCountry ||
      getPaymentFeatures()?.requireDeliveryAddress ||
      getPaymentFeatures<LinkFeaturesDto>()?.canChangeQuantity || // @TODO remove
      getPaymentFeatures<LinkFeaturesDto>()?.canChangePrice
    );
  };

  const initPaymentDetails = async (paymentRequestId: string) => {
    setPaymentDetails(null);
    if (!cluster) {
      throw new Error('Please provide a cluster');
    }
    if (!paymentType) {
      throw new Error('Please provide a payment type');
    }
    const result = await HelioSDK.apiService.getPaymentRequestByIdPublic(
      paymentRequestId,
      paymentType
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

    const validatedMintAddress =
      mintAddress === SOL_MINT ? WRAPPED_SOL_MINT : mintAddress;

    if (validatedMintAddress && cluster) {
      const mintAddresses = await HelioSDK.apiService.getTokenSwapMintAddresses(
        validatedMintAddress
      );

      const currencies = mintAddresses.map((address) =>
        HelioSDK.currencyService.getCurrencyByMint(address)
      );

      const solanaCurrency =
        HelioSDK.currencyService.getCurrencyBySymbol('SOL');
      const bonkCurrency = HelioSDK.currencyService.getCurrencyBySymbol('BONK');

      if (solanaCurrency) {
        currencies.unshift(solanaCurrency);
      }

      if (bonkCurrency && mintAddress !== bonkCurrency.mintAddress) {
        currencies.unshift(bonkCurrency);
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
    totalDecimalAmount: number,
    toMint?: string
  ) => {
    setTokenSwapLoading(true);
    try {
      if (cluster) {
        const tokenSwapJWTResponse =
          await HelioSDK.apiService.getTokenSwapQuote(
            paymentRequestId,
            paymentRequestType,
            fromMint,
            paymentRequestType === PaymentRequestType.PAYLINK
              ? quantity ?? 1
              : undefined,
            HelioSDK.tokenConversionService.convertToMinimalUnits(
              paymentDetails?.currency.symbol,
              totalDecimalAmount
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
          from: HelioSDK.currencyService.getCurrencyByMint(decodedToken.from),
          to: HelioSDK.currencyService.getCurrencyByMint(decodedToken.to),
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
    initPaymentDetails,
    getPaymentFeatures,
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
    paymentType,
    setPaymentType,
  };
};
