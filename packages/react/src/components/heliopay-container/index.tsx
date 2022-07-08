import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';
import ConnectButton from '../connect-button';
import OneTimePaymentButton, {
  OneTimePaymentProps,
} from '../one-time-payment-button';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import Button from '../button';
import WalletController from '../WalletController';
import {
  StyledEnvironment,
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
import { createOneTimePayment } from '../../infrastructure';
import PaymentResult from '../payment-result';

interface HeliopayContainerProps {
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
}

export const HelioPayContainer: FC<HeliopayContainerProps> = ({
  onStartPayment,
  onSuccess,
  paymentRequestId,
  onError,
  onPending,
}) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();

  const [result, setResult] = useState<
    SuccessPaymentEvent | ErrorPaymentEvent | null
  >(null);

  const {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    cluster,
  } = useHelioProvider();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    getPaymentDetails(paymentRequestId);
  }, [paymentRequestId]);

  const getCurrency = (currency?: string) => {
    if (!currency) return;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  const isCustomerDetailsRequired = (): boolean => {
    if (!paymentDetails) return false;
    return (
      paymentDetails.requireEmail ||
      paymentDetails.requireFullName ||
      paymentDetails.requireDiscordUsername ||
      paymentDetails.requireTwitterUsername ||
      paymentDetails.requireCountry ||
      paymentDetails.requireDeliveryAddress ||
      paymentDetails.canChangeQuantity ||
      paymentDetails.canChangePrice ||
      false
    );
  };

  const handleSuccessPayment = (event: SuccessPaymentEvent) => {
    onSuccess(event);
    setResult(event);
    setShowLoadingModal(false);
  };

  const handleErrorPayment = (event: ErrorPaymentEvent) => {
    onError(event);
    setResult(event);
    setShowLoadingModal(false);
  };

  const submitPayment = async ({ amount, quantity, customerDetails }: any) => {
    if (helioProvider) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const payload = {
        anchorProvider: helioProvider,
        recipientPK: paymentDetails?.owner?.wallets?.items?.[0]?.publicKey,
        symbol: getCurrency(paymentDetails?.currency)?.symbol,
        amount: amount * (quantity || 1),
        paymentRequestId,
        onSuccess: handleSuccessPayment,
        onError: handleErrorPayment,
        onPending,
        customerDetails,
        quantity: Number(quantity) || 1,
      };
      await createOneTimePayment(payload);
    }
  };

  return (
    <StyledWrapper>
      {!result ? (
        <>
          <StyledRow>
            <StyledLeft>
              {wallet ? (
                <Button
                  onClick={() => {
                    if (isCustomerDetailsRequired()) {
                      setShowFormModal(true);
                    } else {
                      submitPayment({
                        amount: paymentDetails?.normalizedPrice,
                        quantity: 1,
                        customerDetails: undefined,
                      });
                    }
                  }}
                >
                  PAY
                </Button>
              ) : (
                <>
                  <ConnectButton />
                </>
              )}
            </StyledLeft>
            <StyledRight>
              Powered by
              <StyledLogoContainer>
                <StyledLogo>
                  <HelioLogoGray />
                </StyledLogo>
                {cluster === 'devnet' && (
                  <StyledEnvironment>DEVNET</StyledEnvironment>
                )}
              </StyledLogoContainer>
            </StyledRight>
          </StyledRow>
          {wallet && <WalletController />}
        </>
      ) : (
        <PaymentResult result={result} />
      )}
      {showFormModal && (
        <CustomerDetailsFormModal
          onHide={() => setShowFormModal(false)}
          onSubmit={submitPayment}
        />
      )}

      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
