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
    <div>
      <Button>test button</Button>
      <ConnectButton />
      {paymentDetails && (
        <>
          <h2>currency: {getCurrency(paymentDetails.currency)?.name}</h2>
          <h2>product name: {paymentDetails.name}</h2>
          <h2>
            product amount:{' '}
            {TokenConversionService.convertFromMinimalUnits(
              getCurrency(paymentDetails.currency),
              paymentDetails.normalizedPrice
            )}
          </h2>
        </>
      )}
      <br />
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
    </div>
  );
};

export default HelioPayContainer;
