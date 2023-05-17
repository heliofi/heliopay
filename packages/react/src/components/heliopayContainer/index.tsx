import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  blockchainToNativeToken,
  ClusterHelio,
  ClusterHelioType,
  CreatePaystreamResponse,
  ErrorPaymentEvent,
  LoadingModalStep,
  LoadingModalStepsCount,
  PaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import {
  BlockchainSymbol,
  Currency,
  LinkFeaturesDto,
  PaymentRequestType,
  Paystream,
} from '@heliofi/common';

import { useAccount } from 'wagmi';
import { SubmitPaylinkProps, SubmitPaystreamProps } from './constants';
import PaymentResult from '../paymentResult';
import WalletController from '../WalletController';
import { ButtonWithTooltip } from '../../ui-kits';
import PaylinkCheckout from '../payLink/paylinkCheckout';
import PaystreamCheckout from '../payStream/paystreamCheckout';
import HelioLogoGray from '../../assets/icons/HelioLogoGray';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import PaystreamPaymentResult from '../payStream/paystreamPaymentResult';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import { useTokenConversion } from '../../providers/token-conversion/TokenConversionContext';

import {
  StyledEnvironment,
  StyledLeft,
  StyledLogo,
  StyledLogoContainer,
  StyledRight,
  StyledRow,
  StyledWrapper,
} from './styles';
import {
  CheckoutSearchParams,
  CheckoutSearchParamsValues,
} from '../../domain/services/CheckoutSearchParams';
import { useCheckoutSearchParamsProvider } from '../../providers/checkoutSearchParams/CheckoutSearchParamsContext';
import { ConnectButton } from '../../ui-kits/connectButton';
import { useEVMProvider } from '../../hooks/useEVMProvider';
import LoadingModal from '../modals/loadingModal';
import { useConnect } from '../../hooks/useConnect';
import { getIsBalanceEnough } from '../baseCheckout/actions';

interface HeliopayContainerProps {
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent) => void;
  onError?: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  onStartPayment?: () => void;
  cluster: ClusterHelioType;
  payButtonTitle?: string;
  supportedCurrencies?: string[];
  totalAmount?: number;
  paymentType: PaymentRequestType;
  searchCustomerDetails?: CheckoutSearchParamsValues;
  additionalJSON?: {};
}

const HelioPayContainer: FC<HeliopayContainerProps> = ({
  onStartPayment,
  onSuccess,
  paymentRequestId,
  onError,
  onPending,
  cluster,
  payButtonTitle = 'Pay',
  supportedCurrencies,
  totalAmount,
  paymentType,
  searchCustomerDetails,
  additionalJSON,
}) => {
  const walletSol = useAnchorWallet();
  const isConnectedSOl = !!walletSol;

  const { isConnected: isConnectedEVM } = useAccount();
  const { address: evmPublicKey } = useAccount();

  const solProvider = useAnchorProvider();
  const evmProvider = useEVMProvider();

  const { dynamicRateToken } = useTokenConversion();
  const {
    currencyList,
    getCurrencyList,
    initPaymentDetails,
    getPaymentFeatures,
    getPaymentDetails,
    initCluster,
    cluster: mainCluster,
    isCustomerDetailsRequired,
    tokenSwapQuote,
    paymentType: paymentRequestType,
    setPaymentType,
    activeCurrency,
    initActiveCurrency,
  } = useHelioProvider();
  const connectionProvider = useConnection();

  const paymentDetails = getPaymentDetails();

  const { HelioSDK } = useCompositionRoot();
  const { setCustomerDetails } = useCheckoutSearchParamsProvider();

  const { blockchainEngineRef } = useConnect();

  const [result, setResult] = useState<
    | SuccessPaymentEvent
    | ErrorPaymentEvent
    | PendingPaymentEvent
    | PaymentEvent
    | null
  >(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState<LoadingModalStep>(
    LoadingModalStep.CLOSE
  );
  const [supportedAllowedCurrencies, setSupportedAllowedCurrencies] = useState<
    Currency[]
  >([]);

  const [isOnlyPay, setIsOnlyPay] = useState<boolean>(false);
  const [isBalanceEnough, setIsBalanceEnough] = useState<boolean>(true);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const walletConnected = isConnectedSOl || isConnectedEVM;
  const blockchain = paymentDetails?.currency?.blockchain?.symbol;
  const isDynamic = paymentDetails?.dynamic;
  const canSelectCurrency = supportedAllowedCurrencies.length > 1;
  const canChangeQuantity =
    getPaymentFeatures<LinkFeaturesDto>()?.canChangeQuantity;
  const isInterval = getPaymentDetails<Paystream>()?.maxTime;

  const isPaystreamEVM =
    isConnectedEVM && paymentRequestType === PaymentRequestType.PAYSTREAM;
  const getPaymentTooltip = () => {
    switch (true) {
      case !paymentRequestId:
        return 'Please set payment request id';
      case !paymentDetails?.id:
        return `Cannot find  
        ${paymentType === PaymentRequestType.PAYLINK ? 'Pay link' : ''}
        ${paymentType === PaymentRequestType.PAYSTREAM ? 'Pay stream' : ''}
         data`;
      case isPaystreamEVM:
        return 'Pay Streams - available on Solana now. Coming to ETH soon.';
      case !isBalanceEnough:
        return 'Not enough funds in your wallet';
      case isDynamic && supportedAllowedCurrencies.length === 0:
        return 'Please set allowed supported currencies';
      case isDynamic && !totalAmount:
        return 'Please set total amount';
      case !!(
        paymentType === PaymentRequestType.PAYLINK &&
        blockchainEngineRef.current &&
        blockchainEngineRef.current !==
          paymentDetails?.currency?.blockchain?.engine?.type
      ):
        return 'Please check your wallet connection';
      case !!(paymentType === PaymentRequestType.PAYSTREAM && totalAmount):
        return "You can't pass total amount for pay stream payments";
      case !!(
        paymentType === PaymentRequestType.PAYSTREAM && supportedCurrencies
      ):
        return "You can't pass supported currencies for pay stream payments";
      default:
        return '';
    }
  };

  const isNativeToken =
    blockchain &&
    activeCurrency?.symbol === blockchainToNativeToken.get(blockchain);

  const getLoadingModalStartingStep = useCallback(
    (): LoadingModalStep =>
      isNativeToken
        ? LoadingModalStep.SIGN_TRANSACTION
        : LoadingModalStep.GET_PERMISSION,
    [isNativeToken]
  );

  const getTotalSteps = (): number =>
    isNativeToken
      ? LoadingModalStepsCount.EVM_NATIVE_TOKEN
      : LoadingModalStepsCount.ERC20;

  /** typeof window === 'undefined' means we're on the server */
  const queryString =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[1]
      : undefined;

  const generateSupportedAllowedCurrencies = useCallback(() => {
    if (isDynamic) {
      const supportedAllowedCurrenciesTemp = currencyList.filter(
        (currency) =>
          supportedCurrencies?.includes(currency.symbol) &&
          currency?.blockchain?.symbol === blockchain
      );
      setSupportedAllowedCurrencies(supportedAllowedCurrenciesTemp || []);
    }
  }, [isDynamic, currencyList, supportedCurrencies, blockchain]);

  const getCurrency = (currency?: string): Currency => {
    if (!currency) {
      throw new Error('Unknown currency');
    }

    const currentCurrency = currencyList.find(
      (c: Currency) => c.symbol === currency
    );

    if (!currentCurrency) {
      throw new Error('Unknown currency symbol');
    }
    return currentCurrency;
  };

  const handleSuccessPayment = (event: SuccessPaymentEvent) => {
    onSuccess?.(event);
    setResult(event);
    setShowLoadingModal(LoadingModalStep.CLOSE);
  };

  const handleErrorPayment = (event: ErrorPaymentEvent) => {
    onError?.(event);
    setResult(event);
    setShowLoadingModal(LoadingModalStep.CLOSE);
  };

  const handlePendingPayment = (event: PendingPaymentEvent): void => {
    onPending?.(event);
    setResult(event);
    setShowLoadingModal(LoadingModalStep.CLOSE);
  };

  const handleCancelPayment = (): void => {
    setResult(null);
    setShowLoadingModal(LoadingModalStep.CLOSE);
  };

  const submitPaylink = async ({
    amount,
    currency,
    quantity,
    customerDetails,
    productDetails,
  }: SubmitPaylinkProps) => {
    if (solProvider && currency?.symbol != null) {
      onStartPayment?.();
      setShowLoadingModal(LoadingModalStep.DEFAULT);
      setShowFormModal(false);
      const recipient = String(paymentDetails?.wallet?.publicKey);
      const { symbol } = getCurrency(currency.symbol);

      const payload = {
        anchorProvider: solProvider,
        recipientPK: recipient,
        symbol,
        amount: amount * (quantity || BigInt(1)),
        paymentRequestId,
        onSuccess: handleSuccessPayment,
        onError: handleErrorPayment,
        onPending,
        customerDetails: {
          ...customerDetails,
          additionalJSON: JSON.stringify(additionalJSON),
        },
        quantity: Number(quantity),
        productDetails,
        splitRevenue: getPaymentFeatures()?.splitRevenue,
        splitWallets: paymentDetails?.splitWallets,
        wallet: walletSol as AnchorWallet,
        connection: connectionProvider.connection,
        rateToken: dynamicRateToken,
        canSwapTokens: getPaymentFeatures().canSwapTokens,
        swapRouteToken: tokenSwapQuote?.routeTokenString,
      };

      try {
        await HelioSDK.paylinkService.handleTransaction(payload);
      } catch (error) {
        handleErrorPayment({
          errorMessage: String(error),
        });
      }
    }
  };

  const submitPaylinkEVM = async ({
    amount,
    currency,
    quantity,
    customerDetails,
    productDetails,
  }: SubmitPaylinkProps): Promise<void> => {
    const mintAddress =
      currency &&
      HelioSDK.currencyService.getCurrencyBySymbolAndBlockchain({
        symbol: currency?.symbol ?? '',
        blockchain,
      })?.mintAddress;
    if (
      evmProvider != null &&
      currency?.symbol != null &&
      evmPublicKey != null &&
      mintAddress
    ) {
      onStartPayment?.();
      setShowLoadingModal(getLoadingModalStartingStep());
      setShowFormModal(false);
      const { symbol } = getCurrency(currency.symbol);

      const props = {
        anchorProvider: evmProvider,
        recipientPK: String(paymentDetails?.wallet?.publicKey),
        symbol,
        amount: amount * (quantity || BigInt(1)),
        paymentRequestId,
        blockchain,
        onSuccess: handleSuccessPayment,
        onError: handleErrorPayment,
        onPending: handlePendingPayment,
        onCancel: handleCancelPayment,
        setLoadingModalStep: setShowLoadingModal,
        customerDetails,
        quantity: Number(quantity),
        productDetails,
        splitRevenue: getPaymentFeatures()?.splitRevenue,
        splitWallets: paymentDetails?.splitWallets,
        rateToken: dynamicRateToken,
        canSwapTokens: getPaymentFeatures().canSwapTokens,
        swapRouteToken: tokenSwapQuote?.routeTokenString,
        mintAddress,
        isNativeMintAddress: isNativeToken,
        cluster,
      };

      try {
        if (BlockchainSymbol.POLYGON === blockchain) {
          await HelioSDK.polygonPaylinkService.handleTransaction(props);
        } else {
          await HelioSDK.ethPaylinkService.handleTransaction(props);
        }
      } catch (error) {
        handleErrorPayment({
          errorMessage: String(error),
        });
      }
    }
  };

  const submitPaystream = async ({
    amount,
    currency,
    interval,
    maxTime,
    customerDetails,
    productDetails,
  }: SubmitPaystreamProps) => {
    if (solProvider && currency?.symbol != null) {
      onStartPayment?.();
      setShowLoadingModal(LoadingModalStep.DEFAULT);
      setShowFormModal(false);
      const recipient = String(paymentDetails?.wallet?.publicKey);
      const { symbol } = getCurrency(currency.symbol);

      const payload = {
        anchorProvider: solProvider,
        recipientPK: recipient,
        symbol,
        amount: amount * BigInt(maxTime),
        paymentRequestId,
        onSuccess: (event: SuccessPaymentEvent<CreatePaystreamResponse>) =>
          handleSuccessPayment(event),
        onError: handleErrorPayment,
        onPending,
        customerDetails: {
          ...customerDetails,
          additionalJSON: JSON.stringify(additionalJSON),
        },
        productDetails,
        interval,
        maxTime,
        wallet: walletSol as AnchorWallet,
        connection: connectionProvider.connection,
        rateToken: dynamicRateToken,
        canSwapTokens: getPaymentFeatures().canSwapTokens,
        swapRouteToken: tokenSwapQuote?.routeTokenString,
      };

      try {
        await HelioSDK.paystreamStartService.handleTransaction(payload);
      } catch (error) {
        handleErrorPayment({
          errorMessage: String(error),
        });
      }
    }
  };

  useEffect(() => {
    initCluster(cluster);
  }, [cluster]);

  useEffect(() => {
    setPaymentType(paymentType);
  }, [paymentType]);

  useEffect(() => {
    if (walletConnected) {
      const fetchData = async () => {
        await HelioSDK.availableBalanceService.fetchAvailableBalance({
          publicKey: walletSol?.publicKey,
          connection: connectionProvider?.connection,
          evmPublicKey,
          blockchain: paymentDetails?.currency.blockchain.symbol,
          areCurrenciesDefined: currencyList.length > 0,
          currency: activeCurrency?.symbol,
          canSwapTokens: !!getPaymentFeatures()?.canSwapTokens,
          swapCurrency: 'SOL',
          tokenSwapQuote: tokenSwapQuote ?? undefined,
          decimalAmount:
            HelioSDK.tokenConversionService.convertFromMinimalUnits(
              activeCurrency?.symbol ?? '',
              paymentDetails?.normalizedPrice,
              paymentDetails?.currency?.blockchain?.symbol
            ),
        });
        setAvailableBalance(
          HelioSDK?.availableBalanceService?.availableBalance
        );
      };
      fetchData().catch();
    }
  }, [
    walletConnected,
    paymentDetails,
    currencyList,
    activeCurrency,
    evmPublicKey,
    connectionProvider?.connection,
    tokenSwapQuote,
    walletSol?.publicKey,
  ]);

  useEffect(() => {
    setIsBalanceEnough(
      getIsBalanceEnough({
        HelioSDK,
        activeCurrency,
        paymentDetails,
        blockchain,
      })
    );
  }, [availableBalance]);

  useEffect(() => {
    if (mainCluster) {
      getCurrencyList(blockchain).catch();
    }
  }, [mainCluster, blockchain]);

  useEffect(() => {
    let symbol;
    if (supportedAllowedCurrencies.length === 1) {
      symbol = supportedAllowedCurrencies[0]?.symbol;
    } else if (!canSelectCurrency) {
      symbol = paymentDetails?.currency?.symbol;
    } else if (paymentDetails?.currency?.symbol) {
      symbol = paymentDetails?.currency?.symbol;
    }
    initActiveCurrency(symbol);
  }, [
    paymentDetails,
    currencyList,
    supportedAllowedCurrencies,
    canSelectCurrency,
  ]);

  useEffect(() => {
    generateSupportedAllowedCurrencies();
  }, [generateSupportedAllowedCurrencies]);

  useEffect(() => {
    if (mainCluster && paymentRequestType && paymentRequestId) {
      initPaymentDetails(paymentRequestId).catch();
    }
  }, [paymentRequestId, mainCluster, paymentRequestType, cluster]);

  useEffect(() => {
    if (queryString) {
      const checkoutSearchParams = new CheckoutSearchParams(queryString);
      setCustomerDetails(checkoutSearchParams.getParsedCheckoutSearchParams());
    } else if (searchCustomerDetails) {
      setCustomerDetails(searchCustomerDetails);
    }
  }, [searchCustomerDetails, queryString]);

  useEffect(() => {
    if (
      paymentDetails &&
      !isDynamic &&
      activeCurrency &&
      !isCustomerDetailsRequired &&
      !canChangeQuantity &&
      !isInterval &&
      paymentRequestType === PaymentRequestType.PAYLINK
    ) {
      setIsOnlyPay(true);
    }
  }, [
    paymentDetails,
    isDynamic,
    isCustomerDetailsRequired,
    supportedCurrencies,
    activeCurrency,
    canChangeQuantity,
    isInterval,
  ]);

  return (
    <StyledWrapper>
      {!result ? (
        <>
          <StyledRow>
            <StyledLeft>
              {walletConnected ? (
                <div>
                  <ButtonWithTooltip
                    onClick={() => {
                      if (!isOnlyPay) {
                        setShowFormModal(true);
                      } else if (activeCurrency) {
                        const reqData = {
                          amount: paymentDetails?.normalizedPrice,
                          quantity: BigInt(1),
                          currency: activeCurrency,
                        };

                        if (isConnectedSOl) {
                          submitPaylink(reqData);
                        } else {
                          submitPaylinkEVM(reqData);
                        }
                      }
                    }}
                    /* disabled={
                      !paymentRequestId || !paymentDetails?.id || notEnoughFunds
                    }
                    showTooltip={notEnoughFunds} */
                    disabled={!!getPaymentTooltip()}
                    showTooltip={!!getPaymentTooltip()}
                    tooltipText={getPaymentTooltip()}
                  >
                    {payButtonTitle}
                  </ButtonWithTooltip>
                </div>
              ) : (
                <ConnectButton paymentRequestType={paymentRequestType} />
              )}
            </StyledLeft>
            <StyledRight>
              Powered by
              <StyledLogoContainer>
                <StyledLogo>
                  <HelioLogoGray />
                </StyledLogo>
                {cluster === ClusterHelio.Devnet && (
                  <StyledEnvironment>DEVNET</StyledEnvironment>
                )}
              </StyledLogoContainer>
            </StyledRight>
          </StyledRow>
          {/* {paymentDetails?.message && (
            <StyledErrorMessage>{paymentDetails.message}</StyledErrorMessage>
          )}
          @todo-v fix this case
           */}
          {walletConnected && (
            <WalletController
              paymentRequestType={paymentRequestType}
              publicKey={
                walletSol?.publicKey
                  ? String(walletSol?.publicKey)
                  : String(evmPublicKey)
              }
            />
          )}
        </>
      ) : (
        <>
          {paymentRequestType === PaymentRequestType.PAYLINK && (
            <PaymentResult result={result} blockchain={blockchain} />
          )}
          {paymentRequestType === PaymentRequestType.PAYSTREAM && (
            <PaystreamPaymentResult
              result={
                result as
                  | SuccessPaymentEvent<CreatePaystreamResponse>
                  | ErrorPaymentEvent
              }
              setShowLoadingModal={setShowLoadingModal}
              onPending={onPending}
              onError={handleErrorPayment}
              currency={paymentDetails?.currency}
            />
          )}
        </>
      )}
      {showFormModal && paymentRequestType === PaymentRequestType.PAYLINK && (
        <PaylinkCheckout
          onHide={() => setShowFormModal(false)}
          onSubmit={(data) =>
            isConnectedSOl
              ? submitPaylink(data as SubmitPaylinkProps)
              : submitPaylinkEVM(data as SubmitPaylinkProps)
          }
          supportedAllowedCurrencies={supportedAllowedCurrencies}
          supportedCurrencies={supportedCurrencies}
          totalAmount={totalAmount}
        />
      )}
      {showFormModal && paymentRequestType === PaymentRequestType.PAYSTREAM && (
        <PaystreamCheckout
          onHide={() => setShowFormModal(false)}
          onSubmit={(data) => submitPaystream(data as SubmitPaystreamProps)}
          supportedAllowedCurrencies={[]}
          totalAmount={totalAmount}
        />
      )}
      {showLoadingModal !== LoadingModalStep.CLOSE && (
        <LoadingModal
          onHide={() => setShowLoadingModal(LoadingModalStep.CLOSE)}
          totalSteps={getTotalSteps()}
          step={showLoadingModal}
        />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
