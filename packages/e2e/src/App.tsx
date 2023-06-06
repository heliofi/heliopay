import React, { useState } from 'react';
import {
  ClusterHelio,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';

import { HelioPay } from '@heliofi/react';

import './styles/style.scss';
import { PaymentRequestType } from '@heliofi/common';

window.Buffer = window.Buffer || require('buffer').Buffer;

// @TODO please don't review this file. This file only for development

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    '643d47cee509bc5eb64cff48'
    // '6438352ad4d671306c91778d'
  );

  return (
    <>
      <input
        type="text"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <HelioPay
        // additionalJSON={{ key1: 'value1' }}
        cluster={ClusterHelio.Devnet}
        // customApiUrl="https://dev.api.hel.io/v1"
        paymentRequestId={paymentId}
        onSuccess={(event: SuccessPaymentEvent) => {
          console.log('onSuccess', event);
        }}
        onError={(event: ErrorPaymentEvent) => {
          console.log('onError', event);
        }}
        onPending={(event: PendingPaymentEvent) => {
          console.log('onPending', event);
        }}
        onStartPayment={() => {
          console.log('onStartPayment');
        }}
        // supportedCurrencies={undefined}
        paymentType={PaymentRequestType.PAYLINK}
        // totalAmount={undefined}
      />
    </>
  );
};

export default App;
