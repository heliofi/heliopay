import React, { FC, useEffect, useState } from 'react';
import {
  ClusterType,
  CreatePaystreamResponse,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { Cluster } from '@solana/web3.js';
import {
  BlockchainEngineType,
  BlockchainSymbol,
  Currency,
  PaymentRequestType,
} from '@heliofi/common';

import { useAccount } from 'wagmi';
import { SubmitPaylinkProps, SubmitPaystreamProps } from './constants';
import PaymentResult from '../paymentResult';
import { LoadingModal } from '../loadingModal';
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

interface HeliopayContainerProps {
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent) => void;
  onError?: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  onStartPayment?: () => void;
  cluster: Cluster;
  payButtonTitle?: string;
  supportedCurrencies?: string[];
  totalAmount?: number;
  paymentType: PaymentRequestType;
  searchCustomerDetails?: CheckoutSearchParamsValues;
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
}) => {
  const wallet = useAnchorWallet();
  const { isConnected } = useAccount();
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
  } = useHelioProvider();
  const connectionProvider = useConnection();

  const paymentDetails = getPaymentDetails();

  const { HelioSDK } = useCompositionRoot();
  const { setCustomerDetails } = useCheckoutSearchParamsProvider();

  const [result, setResult] = useState<
    SuccessPaymentEvent | ErrorPaymentEvent | null
  >(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[]>([]);

  const walletConnected = wallet || isConnected;
  const blockchain = paymentDetails?.currency?.blockchain?.symbol;

  // @todo-v swapCurrency
  const isBalanceEnough = HelioSDK.availableBalanceService.isBalanceEnough({
    decimalAmount: HelioSDK.tokenConversionService.convertFromMinimalUnits(
      paymentDetails?.currency.symbol,
      paymentDetails?.normalizedPrice,
      paymentDetails?.currency?.blockchain?.symbol
    ),
    isTokenSwapped: false,
  });

  const notEnoughFunds =
    !(isCustomerDetailsRequired || supportedCurrencies?.length) &&
    !isBalanceEnough;

  /** typeof window === 'undefined' means we're on the server */
  const queryString =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[1]
      : undefined;

  const generateAllowedCurrencies = () => {
    const allowedCurrenciesTemp = currencyList.filter(
      (currency) =>
        supportedCurrencies?.includes(currency.symbol) &&
        (!currency?.blockchain ||
          currency?.blockchain?.engine?.type === BlockchainEngineType.SOL ||
          currency?.blockchain?.engine?.type === BlockchainEngineType.EVM)
    );
    setAllowedCurrencies(allowedCurrenciesTemp || []);
  };

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
    setShowLoadingModal(false);
  };

  const handleErrorPayment = (event: ErrorPaymentEvent) => {
    onError?.(event);
    setResult(event);
    setShowLoadingModal(false);
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
      setShowLoadingModal(true);
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
        customerDetails,
        quantity: Number(quantity),
        productDetails,
        splitRevenue: getPaymentFeatures()?.splitRevenue,
        splitWallets: paymentDetails?.splitWallets,
        wallet: wallet as AnchorWallet,
        connection: connectionProvider.connection,
        rateToken: dynamicRateToken,
        cluster,
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
        symbol: paymentDetails?.currency.symbol, // @todo-v select currency
        blockchain,
      })?.mintAddress;
    if (
      evmProvider != null &&
      currency?.symbol != null &&
      evmPublicKey != null &&
      mintAddress
    ) {
      onStartPayment?.();
      setShowLoadingModal(true);
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
        onPending,
        onCancel: handleErrorPayment,
        onInitiated: onPending,
        setLoadingModalStep: () => setShowLoadingModal(true),
        customerDetails,
        quantity: Number(quantity),
        productDetails,
        splitRevenue: getPaymentFeatures()?.splitRevenue,
        splitWallets: paymentDetails?.splitWallets,
        rateToken: dynamicRateToken,
        canSwapTokens: getPaymentFeatures().canSwapTokens,
        swapRouteToken: tokenSwapQuote?.routeTokenString,
        mintAddress,
        isNativeMintAddress: true, // @todo-v
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
      setShowLoadingModal(true);
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
        customerDetails,
        productDetails,
        interval,
        maxTime,
        wallet: wallet as AnchorWallet,
        connection: connectionProvider.connection,
        rateToken: dynamicRateToken,
        canSwapTokens: getPaymentFeatures().canSwapTokens,
        swapRouteToken: tokenSwapQuote?.routeTokenString,
        cluster,
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

  // @todo-v swapCurrency
  useEffect(() => {
    if (walletConnected) {
      const fetchData = async () => {
        await HelioSDK.availableBalanceService.fetchAvailableBalance({
          publicKey: wallet?.publicKey,
          evmPublicKey,
          blockchain: paymentDetails?.currency.blockchain.symbol,
          areCurrenciesDefined: currencyList.length > 0,
          currency: paymentDetails?.currency.symbol,
          canSwapTokens: !!getPaymentFeatures()?.canSwapTokens,
          swapCurrency: 'SOL',
          tokenSwapQuote: tokenSwapQuote ?? undefined,
          decimalAmount:
            HelioSDK.tokenConversionService.convertFromMinimalUnits(
              paymentDetails?.currency.symbol,
              paymentDetails?.normalizedPrice,
              paymentDetails?.currency?.blockchain?.symbol
            ),
        });
      };
      fetchData().catch();
    }
  }, [walletConnected, paymentDetails, currencyList]);

  useEffect(() => {
    if (mainCluster) {
      getCurrencyList().catch();
    }
  }, [mainCluster]);

  useEffect(() => {
    if (supportedCurrencies) {
      generateAllowedCurrencies();
    }
  }, [currencyList, supportedCurrencies]);

  useEffect(() => {
    if (mainCluster && paymentRequestType && paymentRequestId) {
      initPaymentDetails(paymentRequestId).catch();
    }
  }, [paymentRequestId, mainCluster, paymentRequestType]);

  useEffect(() => {
    if (queryString) {
      const checkoutSearchParams = new CheckoutSearchParams(queryString);
      setCustomerDetails(checkoutSearchParams.getParsedCheckoutSearchParams());
    } else if (searchCustomerDetails) {
      setCustomerDetails(searchCustomerDetails);
    }
  }, [searchCustomerDetails, queryString]);

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
                      if (
                        isCustomerDetailsRequired ||
                        supportedCurrencies?.length
                      ) {
                        setShowFormModal(true);
                      } else if (paymentDetails) {
                        submitPaylink({
                          amount: paymentDetails?.normalizedPrice,
                          quantity: BigInt(1),
                          customerDetails: undefined,
                          currency: paymentDetails?.currency,
                        });
                      }
                    }}
                    disabled={
                      !paymentRequestId || !paymentDetails?.id || notEnoughFunds
                    }
                    showTooltip={notEnoughFunds}
                    tooltipText="Not enough funds in your wallet"
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
                {cluster === ClusterType.Devnet && (
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
              blockchain={blockchain}
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
            wallet
              ? submitPaylink(data as SubmitPaylinkProps)
              : submitPaylinkEVM(data as SubmitPaylinkProps)
          }
          allowedCurrencies={allowedCurrencies}
          totalAmount={totalAmount}
        />
      )}
      {showFormModal && paymentRequestType === PaymentRequestType.PAYSTREAM && (
        <PaystreamCheckout
          onHide={() => setShowFormModal(false)}
          onSubmit={(data) => submitPaystream(data as SubmitPaystreamProps)}
          allowedCurrencies={[]}
          totalAmount={totalAmount}
        />
      )}
      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
