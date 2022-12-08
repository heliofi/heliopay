import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { Cluster } from '@solana/web3.js';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import ConnectButton from '../connect-button';
import {
  ClusterType,
  Currency,
  CustomerDetails,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import Button from '../button';
import WalletController from '../WalletController';
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
import HelioLogoGray from '../icons/HelioLogoGray';
import CustomerDetailsFormModal from '../customer-details-form-modal';
import { LoadingModal } from '../loading-modal';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import PaymentResult from '../payment-result';
import { useAddressProvider } from '../../providers/address/AddressContext';
import { ProductDetails } from '../../domain/model/ProductDetails';
import {
  ApproveTransactionResponse,
  PaylinkSubmitService,
} from '../../infrastructure/solana-utils/payment/paylink/PaylinkSubmitService';
import { useTokenConversion } from '../../providers/token-conversion/TokenConversionContext';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import { JWTService } from '../../domain/services/JWTService';
import { now } from '../../utils';

interface HeliopayContainerProps {
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent<ApproveTransactionResponse>) => void;
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
  const connectionProvider = useConnection();

  const { getCountry } = useAddressProvider();

  const { getTokenPrice, dynamicRateToken, tokenExpiration } =
    useTokenConversion();

  const [result, setResult] = useState<
    SuccessPaymentEvent<ApproveTransactionResponse> | ErrorPaymentEvent | null
  >(null);

  const {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    initCluster,
    cluster: mainCluster,
    isCustomerDetailsRequired,
  } = useHelioProvider();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[] | null>(
    null
  );

  const [actualPrice, setActualPrice] = useState(0);

  useEffect(() => {
    initCluster(cluster);
  }, [cluster]);

  const generateAllowedCurrencies = () => {
    const allowedCurrenciesTemp = currencyList.filter((currency) =>
      supportedCurrencies?.includes(currency.symbol)
    );
    setAllowedCurrencies(allowedCurrenciesTemp);
  };

  const delay = (cb: () => void, ms: number) => {
    // eslint-disable-next-line no-new
    new Promise((Resolve) => {
      setTimeout(() => {
        Resolve(cb());
      }, ms);
    });
  };

  const nowMS = now();
  const expirationMS = tokenExpiration ? tokenExpiration * 1000 : 0;

  useEffect(() => {
    if (
      tokenExpiration &&
      paymentDetails?.fixedCurrency?.price &&
      paymentDetails?.currency &&
      paymentDetails?.fixedCurrency?.price &&
      expirationMS > nowMS
    ) {
      delay(() => {
        getTokenPrice({
          from: paymentDetails?.fixedCurrency?.currency,
          to: paymentDetails?.currency?.symbol,
          amount: paymentDetails?.fixedCurrency?.price,
        });
      }, expirationMS - nowMS);
    }
  }, [
    tokenExpiration,
    paymentDetails?.fixedCurrency,
    paymentDetails?.currency,
    paymentDetails?.fixedCurrency,
    expirationMS,
  ]);

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
    return currencyList.find((c: any) => c.symbol === currency);
  };

  useEffect(() => {
    if (
      paymentDetails?.features?.requireDeliveryAddress &&
      paymentDetails?.features?.requireCountry
    ) {
      getCountry();
    }

    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      if (
        paymentDetails?.fixedCurrency &&
        paymentDetails?.features?.requireFixedCurrency
      ) {
        getTokenPrice({
          from: paymentDetails?.fixedCurrency.currency,
          to: paymentDetails?.currency?.symbol,
          amount: paymentDetails?.fixedCurrency.price,
        });
      }
      setActualPrice(
        TokenConversionService.convertFromMinimalUnits(
          getCurrency(paymentDetails?.currency?.symbol),
          paymentDetails?.normalizedPrice
        )
      );
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      if (paymentDetails?.features?.requireFixedCurrency && dynamicRateToken) {
        const decodedRateToken = JWTService.decodeToken(dynamicRateToken);
        const dynamicPrice = decodedRateToken.rate;

        setActualPrice(
          TokenConversionService.convertFromMinimalUnits(
            paymentDetails.currency,
            dynamicPrice
          )
        );
      } else {
        setActualPrice(
          TokenConversionService.convertFromMinimalUnits(
            paymentDetails?.currency,
            paymentDetails?.normalizedPrice
          )
        );
      }
    }
  }, [dynamicRateToken, paymentDetails]);


  
  const handleSuccessPayment = (
    event: SuccessPaymentEvent<ApproveTransactionResponse>
  ) => {
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
    if (helioProvider && currency?.symbol != null && wallet) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const recipient = paymentDetails?.wallet?.publicKey;
      const { symbol } = getCurrency(currency.symbol);
      if (symbol == null) throw new Error('Unknown currency symbol');
      try {
        await new PaylinkSubmitService().handleTransaction({
          anchorProvider: helioProvider,
          recipientPK: recipient,
          symbol: symbol,
          amount: amount * (quantity || 1),
          paymentRequestId,
          onSuccess: handleSuccessPayment,
          onError: handleErrorPayment,
          onPending: onPending,
          customerDetails: customerDetails,
          quantity: Number(quantity),
          productDetails: productDetails,
          splitRevenue: paymentDetails?.features?.splitRevenue,
          splitWallets: paymentDetails?.splitWallets,
          wallet: wallet,
          connection: connectionProvider.connection,
          rateToken: dynamicRateToken,
          cluster: cluster,
        });
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
        <CustomerDetailsFormModal
          onHide={() => setShowFormModal(false)}
          onSubmit={submitPayment}
          allowedCurrencies={allowedCurrencies}
          totalAmount={totalAmount}
          normalizedPrice={actualPrice}
          requireFixedCurrency={paymentDetails?.features?.requireFixedCurrency}
          fixedPrice={paymentDetails?.fixedCurrency?.price}
          fixedCurrency={paymentDetails?.fixedCurrency?.currency}
        />
      )}

      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
