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

interface HeliopayContainerProps {
  receiverSolanaAddress: string;
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  quantity?: number;
}

export const HelioPayContainer: FC<HeliopayContainerProps> = ({
  onStartPayment,
  onSuccess,
  receiverSolanaAddress,
  paymentRequestId,
  onError,
  onPending,
  quantity = 1,
}) => {
  const wallet = useAnchorWallet();

  const { currencyList, paymentDetails, getCurrencyList, getPaymentDetails } =
    useHelioProvider();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

  return (
    <StyledWrapper>
      <StyledRow>
        <StyledLeft>
          {wallet ? (
            <OneTimePaymentButton
              amount={paymentDetails.normalizedPrice}
              currency={getCurrency(paymentDetails.currency)?.symbol}
              onStartPayment={onStartPayment}
              onSuccess={onSuccess}
              receiverSolanaAddress={receiverSolanaAddress}
              paymentRequestId={paymentRequestId}
              onError={onError}
              onPending={onPending}
              quantity={quantity}
              isFormSubmitted={isFormSubmitted}
            />
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
    </StyledWrapper>
  );
};

export default HelioPayContainer;
