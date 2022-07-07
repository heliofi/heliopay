import {
  Cluster,
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

import './style.scss';
import { useHelioProvider } from '../../providers/helio/HelioContext';

interface HelioPayProps {
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  theme?: DefaultTheme;
  cluster: Cluster;
}

export const HelioPay = ({
  paymentRequestId,
  onSuccess,
  onError,
  onPending,
  onStartPayment,
  theme,
  cluster,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const { setCluster } = useHelioProvider();

  useEffect(() => {
    setCluster(cluster);
  }, [cluster]);

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
        />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
