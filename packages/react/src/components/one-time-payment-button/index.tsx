import React, { useCallback, useEffect, useState } from 'react';

import { LoadingModal } from '../index';

import {
  CustomerDetails,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import { createOneTimePayment } from '../../infrastructure';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import Button from '../button';
import { StyledButtonContainer } from './styles';

export interface OneTimePaymentProps {
  amount: number;
  currency?: string;
  onStartPayment?: () => void;
  receiverSolanaAddress: string;
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  isFormSubmitted: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  customerDetails?: CustomerDetails;
  quantity?: number;
  disabled?: boolean;
}

export const OneTimePaymentButton: React.FC<OneTimePaymentProps> = ({
  amount,
  currency,
  onStartPayment,
  onSuccess,
  receiverSolanaAddress,
  paymentRequestId,
  onError,
  onPending,
  isFormSubmitted,
  type,
  customerDetails,
  quantity,
  disabled
}) => {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const helioProvider = useAnchorProvider();

  const updateSuccessfulPayment = useCallback(
    (event: SuccessPaymentEvent) => {
      setShowLoadingModal(false);
      onSuccess(event);
    },
    [onSuccess]
  );

  const onStartPaymentFlow = useCallback(async () => {
    setShowLoadingModal(true);
    if (helioProvider && currency != null) {
      onStartPayment?.();
      await createOneTimePayment({
        anchorProvider: helioProvider,
        recipientPK: receiverSolanaAddress,
        symbol: currency,
        amount: amount * (quantity || 1),
        paymentRequestId,
        onSuccess: updateSuccessfulPayment,
        onError,
        onPending,
        customerDetails,
        quantity: Number(quantity) || 1,
      });
    }
  }, [
    amount,
    quantity,
    currency,
    customerDetails,
    helioProvider,
    onError,
    onPending,
    onStartPayment,
    paymentRequestId,
    receiverSolanaAddress,
    updateSuccessfulPayment,
  ]);

  useEffect(() => {
    if (isFormSubmitted) {
      onStartPaymentFlow();
    }
  }, [isFormSubmitted, onStartPaymentFlow]);

  return (
    <>
      <StyledButtonContainer>
        <Button
          type="button"
          disabled={disabled}
          onClick={async () =>
            type !== 'submit' && (await onStartPaymentFlow())
          }
          className="rounded-lg text-sm"
        >
          PAY
        </Button>
      </StyledButtonContainer>
      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </>
  );
};

export default OneTimePaymentButton;
