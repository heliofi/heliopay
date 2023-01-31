import { DefaultTheme, ThemeProvider } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { Cluster } from '@solana/web3.js';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';
import { SolanaProvider } from '../../providers';
import HelioPayContainer from '../heliopay-container';
import { defaultTheme } from '../../theme';
import { deepMerge } from '../../utils';
import { useCompositionRoot } from '../../hooks/compositionRoot';

interface HelioPayProps {
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent) => void;
  onError?: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  onStartPayment?: () => void;
  theme?: DefaultTheme;
  cluster: Cluster;
  payButtonTitle?: string;
  supportedCurrencies?: string[];
  totalAmount?: number;
}

export const HelioPay = ({
  paymentRequestId,
  onSuccess,
  onError,
  onPending,
  onStartPayment,
  theme,
  cluster,
  payButtonTitle,
  supportedCurrencies,
  totalAmount,
}: HelioPayProps) => {
  useMemo(() => {
    const { HelioSDK } = useCompositionRoot();
    HelioSDK.setCluster(cluster as Cluster);
  }, [cluster]);

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
          payButtonTitle={payButtonTitle}
          supportedCurrencies={supportedCurrencies}
          totalAmount={totalAmount}
        />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
