import { useAnchorWallet } from '@solana/wallet-adapter-react';
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
import HelioLogoGray from '../../assets/icons/HelioLogoGray';
import CustomerDetailsFormModal from '../customer-details-form-modal';
import { LoadingModal } from '../loading-modal';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import { createOneTimePayment } from '../../infrastructure';
import PaymentResult from '../payment-result';
import { useAddressProvider } from '../../providers/address/AddressContext';
import { ProductDetails } from '../../domain/model/ProductDetails';

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
  const { getCountry } = useAddressProvider();

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
  } = useHelioProvider();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[] | null>(
    null
  );

  useEffect(() => {
    initCluster(cluster);
  }, [cluster]);

  useEffect(() => {
    if (
      paymentDetails?.features?.requireDeliveryAddress &&
      paymentDetails?.features?.requireCountry
    ) {
      getCountry();
    }
  }, [paymentDetails]);

  const generateAllowedCurrencies = () => {
    const allowedCurrenciesTemp = currencyList.filter((currency) =>
      supportedCurrencies?.includes(currency.symbol)
    );
    setAllowedCurrencies(allowedCurrenciesTemp);
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
    return currencyList.find((c: any) => c.symbol === currency);
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
      if (symbol == null) throw new Error('Unknown currency symbol');
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
        productDetails,
        quantity: Number(quantity) ?? 1,
        cluster,
      };
      try {
        await createOneTimePayment(payload);
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
        />
      )}

      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
