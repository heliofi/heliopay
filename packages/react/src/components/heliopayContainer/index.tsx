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
  Currency,
  PaymentRequestType,
} from '@heliofi/common';

import {
  SubmitPaymentPaylinkProps,
  SubmitPaymentPaystreamProps,
} from './constants';
import PaymentResult from '../paymentResult';
import { LoadingModal } from '../loadingModal';
import WalletController from '../WalletController';
import { Button, ConnectButton } from '../../ui-kits';
import PaylinkCheckout from '../payLink/paylinkCheckout';
import PaystreamChekout from '../payStream/paystreamChekout';
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
}) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();
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
  const { HelioSDK } = useCompositionRoot();
  const connectionProvider = useConnection();

  const [result, setResult] = useState<
    SuccessPaymentEvent | ErrorPaymentEvent | null
  >(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[]>([]);

  const paymentDetails = getPaymentDetails();

  const generateAllowedCurrencies = () => {
    const allowedCurrenciesTemp = currencyList.filter(
      (currency) =>
        supportedCurrencies?.includes(currency.symbol) &&
        (!currency?.blockchain ||
          currency?.blockchain?.engine?.type === BlockchainEngineType.SOL)
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

  const submitPaymentPaylink = async ({
    amount,
    currency,
    quantity,
    customerDetails,
    productDetails,
  }: SubmitPaymentPaylinkProps) => {
    if (helioProvider && currency?.symbol != null) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const recipient = paymentDetails?.wallet?.publicKey as string;
      const { symbol } = getCurrency(currency.symbol);

      const payload = {
        anchorProvider: helioProvider,
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

  const submitPaymentPaystream = async ({
    amount,
    currency,
    interval,
    maxTime,
    customerDetails,
    productDetails,
  }: SubmitPaymentPaystreamProps) => {
    if (helioProvider && currency?.symbol != null) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const recipient = paymentDetails?.wallet?.publicKey as string;
      const { symbol } = getCurrency(currency.symbol);

      const payload = {
        anchorProvider: helioProvider,
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

  useEffect(() => {
    if (mainCluster) {
      getCurrencyList();
    }
  }, [mainCluster]);

  useEffect(() => {
    if (supportedCurrencies) {
      generateAllowedCurrencies();
    }
  }, [currencyList, supportedCurrencies]);

  useEffect(() => {
    if (mainCluster && paymentRequestType && paymentRequestId) {
      initPaymentDetails(paymentRequestId);
    }
  }, [paymentRequestId, mainCluster, paymentRequestType]);

  return (
    <StyledWrapper>
      {!result ? (
        <>
          <StyledRow>
            <StyledLeft>
              {wallet ? (
                <div>
                  <Button
                    onClick={() => {
                      if (
                        isCustomerDetailsRequired ||
                        supportedCurrencies?.length
                      ) {
                        setShowFormModal(true);
                      } else if (paymentDetails) {
                        submitPaymentPaylink({
                          amount: paymentDetails?.normalizedPrice,
                          quantity: BigInt(1),
                          customerDetails: undefined,
                          currency: paymentDetails?.currency,
                        });
                      }
                    }}
                    disabled={!paymentRequestId || !paymentDetails?.id}
                  >
                    {payButtonTitle}
                  </Button>
                </div>
              ) : (
                <ConnectButton />
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
          {wallet && <WalletController />}
        </>
      ) : (
        <>
          {paymentRequestType === PaymentRequestType.PAYLINK && (
            <PaymentResult result={result} />
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
            submitPaymentPaylink(data as SubmitPaymentPaylinkProps)
          }
          allowedCurrencies={allowedCurrencies}
          totalAmount={totalAmount}
        />
      )}
      {showFormModal && paymentRequestType === PaymentRequestType.PAYSTREAM && (
        <PaystreamChekout
          onHide={() => setShowFormModal(false)}
          onSubmit={(data) =>
            submitPaymentPaystream(data as SubmitPaymentPaystreamProps)
          }
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
