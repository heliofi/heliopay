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

import { Cluster } from '@solana/web3.js';

interface HelioPayProps {
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  theme?: DefaultTheme;
  cluster: Cluster;
  payButtonCTA?: string;
}

export const HelioPay = ({
  paymentRequestId,
  onSuccess,
  onError,
  onPending,
  onStartPayment,
  theme,
  cluster,
  payButtonCTA,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  useEffect(() => {
    const mergedTheme = deepMerge(defaultTheme, theme || {});
    setCurrentTheme(mergedTheme);
  }, [theme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <SolanaProvider cluster={cluster}>
        <HelioPayContainer
          paymentRequestId={paymentRequestId}
          onStartPayment={onStartPayment}
          onSuccess={onSuccess}
          onError={onError}
          onPending={onPending}
          cluster={cluster}
          payButtonCTA={payButtonCTA}
        />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
