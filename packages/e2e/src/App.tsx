import React, { useState } from 'react';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';

import { HelioPay } from '@heliofi/react';

import './styles/style.scss';

window.Buffer = window.Buffer || require('buffer').Buffer;

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    '646c986378c7819bf8f14c8c'
  );

  return (
    <>
      <input
        type="text"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <HelioPay
        additionalJSON={{ key1: 'value1' }}
        cluster="mainnet-beta"
        customApiUrl="https://api.hel.io/v1"
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
        supportedCurrencies={['USDC', 'SOL']}
        // paymentType={PaymentRequestType.PAYSTREAM}
        // totalAmount={0.01} // @TODO bug when also has normalizedPrice
      />
    </>
  );
};

export default App;
