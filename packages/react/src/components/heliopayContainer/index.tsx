import React, { FC, useEffect, useState } from 'react';
import {
  ClusterType,
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
  Currency,
  CustomerDetails,
  ProductDetails,
  BlockchainEngineType,
} from '@heliofi/common';

import PaymentResult from '../paymentResult';
import { LoadingModal } from '../loadingModal';
import WalletController from '../WalletController';
import { Button, ConnectButton } from '../../ui-kits';
import PaylinkCheckout from '../payLink/paylinkCheckout';
import HelioLogoGray from '../../assets/icons/HelioLogoGray';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import { useTokenConversion } from '../../providers/token-conversion/TokenConversionContext';

import {
  StyledEnvironment,
  StyledErrorMessage,
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
}) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();
  const { dynamicRateToken } = useTokenConversion();
  const connectionProvider = useConnection();
  const [result, setResult] = useState<
    SuccessPaymentEvent | ErrorPaymentEvent | null
  >(null);

  const {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    initCluster,
    cluster: mainCluster,
    isCustomerDetailsRequired,
    tokenSwapQuote,
  } = useHelioProvider();
  const { HelioSDK } = useCompositionRoot();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    initCluster(cluster);
  }, [cluster]);

  const generateAllowedCurrencies = () => {
    const allowedCurrenciesTemp = currencyList.filter(
      (currency) =>
        supportedCurrencies?.includes(currency.symbol) &&
        (!currency?.blockchain ||
          currency?.blockchain?.engine?.type === BlockchainEngineType.SOL)
    );
    setAllowedCurrencies(allowedCurrenciesTemp || []);
  };

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
    if (mainCluster) {
      getPaymentDetails(paymentRequestId);
    }
  }, [paymentRequestId, mainCluster]);

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

  const submitPayment = async ({
    amount,
    currency,
    quantity,
    customerDetails,
    productDetails,
  }: {
    amount: number;
    currency: Currency;
    quantity: number;
    customerDetails?: CustomerDetails;
    productDetails?: ProductDetails;
  }) => {
    if (helioProvider && currency?.symbol != null) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const recipient = paymentDetails?.wallet?.publicKey;
      const { symbol } = getCurrency(currency.symbol);

      const payload = {
        anchorProvider: helioProvider,
        recipientPK: recipient,
        symbol,
        amount: amount * (quantity || 1),
        paymentRequestId,
        onSuccess: handleSuccessPayment,
        onError: handleErrorPayment,
        onPending,
        customerDetails,
        quantity: Number(quantity),
        productDetails,
        splitRevenue: paymentDetails?.features?.splitRevenue,
        splitWallets: paymentDetails?.splitWallets,
        wallet: wallet as AnchorWallet,
        connection: connectionProvider.connection,
        rateToken: dynamicRateToken,
        cluster,
        canSwapTokens: paymentDetails?.features.canSwapTokens,
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
                      } else {
                        submitPayment({
                          amount: paymentDetails?.normalizedPrice,
                          quantity: 1,
                          customerDetails: undefined,
                          currency: paymentDetails?.currency,
                        });
                      }
                    }}
                    disabled={!paymentDetails?.id}
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

          {paymentDetails?.message && (
            <StyledErrorMessage>{paymentDetails.message}</StyledErrorMessage>
          )}
          {wallet && <WalletController />}
        </>
      ) : (
        <PaymentResult result={result} />
      )}
      {showFormModal && (
        <PaylinkCheckout
          onHide={() => setShowFormModal(false)}
          onSubmit={submitPayment}
          allowedCurrencies={allowedCurrencies}
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
