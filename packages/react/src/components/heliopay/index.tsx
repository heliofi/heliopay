import { DefaultTheme, ThemeProvider } from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ClusterHelioType,
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
import { EVMProvider } from '../../providers/wagmi';
import ConnectProvider from '../../providers/connect';

interface HelioPayProps {
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent) => void;
  onError?: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  onStartPayment?: () => void;
  theme?: DefaultTheme;
  cluster: ClusterHelioType;
  payButtonTitle?: string;
  supportedCurrencies?: string[];
  totalAmount?: number;
  paymentType?: PaymentRequestType;
  searchCustomerDetails?: CheckoutSearchParamsValues;
  additionalJSON?: {};
  customApiUrl?: string;
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
  customApiUrl,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const { HelioSDK } = useCompositionRoot();

  useMemo(() => {
    HelioSDK.setCluster(cluster);
  }, [cluster]);

  useMemo(() => {
    if (customApiUrl) {
      HelioSDK.setCustomApiUrl(customApiUrl);
    }
  }, [customApiUrl]);

  useEffect(() => {
    const mergedTheme = deepMerge(defaultTheme, theme || {});
    setCurrentTheme(mergedTheme);
  }, [theme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <EVMProvider>
        <SolanaProvider cluster={cluster}>
          <ConnectProvider>
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
          </ConnectProvider>
        </SolanaProvider>
      </EVMProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
