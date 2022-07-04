import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import { SolanaProvider } from '../../providers';
import HelioPayContainer from '../heliopay-container';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme';

interface HelioPayProps {
  receiverSolanaAddress: string;
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  quantity?: number;
}

export const HelioPay = ({
  receiverSolanaAddress,
  paymentRequestId,
  onSuccess,
  onError,
  onPending,
  onStartPayment,
  quantity = 1,
}: HelioPayProps) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SolanaProvider>
        <HelioPayContainer
          receiverSolanaAddress={receiverSolanaAddress}
          paymentRequestId={paymentRequestId}
          onStartPayment={onStartPayment}
          onSuccess={onSuccess}
          onError={onError}
          onPending={onPending}
          quantity={quantity}
        />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
