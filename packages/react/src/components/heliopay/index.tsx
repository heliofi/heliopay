import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import { SolanaProvider } from '../../providers';
import HelioPayContainer from '../heliopay-container';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme';
import { useEffect, useState } from 'react';
import { deepMerge } from '../../utils';

interface HelioPayProps {
  receiverSolanaAddress: string;
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  quantity?: number;
  theme?: DefaultTheme;
}

export const HelioPay = ({
  receiverSolanaAddress,
  paymentRequestId,
  onSuccess,
  onError,
  onPending,
  onStartPayment,
  quantity = 1,
  theme,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  useEffect(() => {
    const mergedTheme = deepMerge(defaultTheme, theme || {});
    console.log({ mergedTheme });
    setCurrentTheme(mergedTheme);
  }, [theme]);

  return (
    <ThemeProvider theme={currentTheme}>
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
