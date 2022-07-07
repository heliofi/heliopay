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
  StyledLeft,
  StyledLogo,
  StyledRight,
  StyledRow,
  StyledWrapper,
} from './styles';
import HelioLogoGray from '../icons/HelioLogoGray';
import CustomerDetailsFormModal from '../customer-details-form-modal';
import { LoadingModal } from '../loading-modal';

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

  const { currencyList, paymentDetails, getCurrencyList, getPaymentDetails } =
    useHelioProvider();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
      false
    );
  };

  return (
    <StyledWrapper>
      <StyledRow>
        <StyledLeft>
          {wallet ? (
            isCustomerDetailsRequired() ? (
              <Button onClick={() => setShowFormModal(true)}>PAY</Button>
            ) : (
              <OneTimePaymentButton
                amount={paymentDetails?.normalizedPrice}
                currency={getCurrency(paymentDetails?.currency)?.symbol}
                onStartPayment={onStartPayment}
                onSuccess={onSuccess}
                receiverSolanaAddress={
                  paymentDetails?.owner?.wallets?.items?.[0]?.publicKey
                }
                paymentRequestId={paymentRequestId}
                onError={onError}
                onPending={onPending}
                quantity={1}
                isFormSubmitted={isFormSubmitted}
                disabled={!paymentDetails}
              />
            )
          ) : (
            <>
              <ConnectButton />
            </>
          )}
        </StyledLeft>
        <StyledRight>
          Powered by
          <StyledLogo>
            <HelioLogoGray />
          </StyledLogo>
        </StyledRight>
      </StyledRow>
      {wallet && <WalletController />}
      {showFormModal && (
        <CustomerDetailsFormModal
          onHide={() => setShowFormModal(false)}
          onStartPayment={function (): void {
            console.log('onStartPayment');
            setShowFormModal(false);
            setShowLoadingModal(true);
          }}
          onSuccess={function (event: SuccessPaymentEvent): void {
            console.log('onSuccess', { event });
            setShowLoadingModal(false);
          }}
          paymentRequestId={paymentRequestId}
          onError={function (event: ErrorPaymentEvent): void {
            console.log('onError', { event });
            setShowLoadingModal(false);
          }}
          onPending={function (event: PendingPaymentEvent): void {
            console.log('onPending', { event });
          }}
        />
      )}

      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
