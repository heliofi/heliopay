import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { FC, ReactNode } from 'react';
import { ErrorPaymentEvent, PendingPaymentEvent, SuccessPaymentEvent } from 'src/domain';
import ConnectButton from '../connect-button';
import OneTimePaymentButton, { OneTimePaymentProps } from '../one-time-payment-button';

interface HeliopayContainerProps extends OneTimePaymentProps {
  buttonType: OneTimePaymentProps['type'];
}

export const HelioPayContainer: FC<HeliopayContainerProps> = ({
  amount,
  currency,
  onStartPayment,
  onSuccess,
  receiverSolanaAddress,
  paymentRequestId,
  onError,
  onPending,
  isFormSubmitted,
  buttonType,
  customerDetails,
  quantity,
}) => {
  const wallet = useAnchorWallet();
  return (
    <div>
      {wallet ? (
        <div>
          <OneTimePaymentButton
            amount={amount}
            currency={currency}
            onStartPayment={onStartPayment}
            onSuccess={onSuccess}
            receiverSolanaAddress={receiverSolanaAddress}
            paymentRequestId={paymentRequestId}
            onError={onError}
            onPending={onPending}
            isFormSubmitted={isFormSubmitted}
            type={buttonType}
            customerDetails={customerDetails}
            quantity={quantity}
          />
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};

export default HelioPayContainer;
