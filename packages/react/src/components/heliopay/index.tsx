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
import { UserSetPropertiesProvider } from '../../providers/userSetProperties/UserSetPropertiesContext';

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
  customApiUrl?: string;
  debugMode?: boolean;
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
  debugMode = false,
}: HelioPayProps) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const { HelioSDK } = useCompositionRoot();

  useMemo(() => {
    HelioSDK.setCluster(cluster as Cluster);
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
      <SolanaProvider cluster={cluster}>
        <UserSetPropertiesProvider debugMode={debugMode}>
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
        </UserSetPropertiesProvider>
        <Toaster />
      </SolanaProvider>
    </ThemeProvider>
  );
};

export default HelioPay;
