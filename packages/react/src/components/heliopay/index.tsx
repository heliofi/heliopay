import { DefaultTheme, ThemeProvider } from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import { Cluster } from '@solana/web3.js';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';
import { Toaster } from 'react-hot-toast';
import { PaymentRequestType } from '@heliofi/common';

import { deepMerge } from '../../utils';
import { defaultTheme } from '../../theme';
import { SolanaProvider } from '../../providers';
import HelioPayContainer from '../heliopayContainer';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { CheckoutSearchParamsValues } from '../../domain/services/CheckoutSearchParams';

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
  paymentType?: PaymentRequestType;
  searchCustomerDetails?: CheckoutSearchParamsValues;
  additionalJSON?: {};
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
  paymentType = PaymentRequestType.PAYLINK,
  searchCustomerDetails,
  additionalJSON,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const { HelioSDK } = useCompositionRoot();

  useMemo(() => {
    HelioSDK.setCluster(cluster as Cluster);
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
          cluster={cluster}
          payButtonTitle={payButtonTitle}
          supportedCurrencies={supportedCurrencies}
          totalAmount={totalAmount}
          paymentType={paymentType}
          searchCustomerDetails={searchCustomerDetails}
          additionalJSON={additionalJSON}
        />
        <Toaster />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
