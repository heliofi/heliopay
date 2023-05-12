import React, { useState } from 'react';
import {
  ClusterHelio,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';

import { HelioPay } from '@heliofi/react/dist';

import './styles/style.scss';
import { PaymentRequestType } from '@heliofi/common';

window.Buffer = window.Buffer || require('buffer').Buffer;

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    // '643d47cee509bc5eb64cff48'
    '645e2983732b5a7ef1aa2d97'
  );

  return (
    <>
      <input
        type="text"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <HelioPay
        cluster={ClusterHelio.Devnet}
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
        supportedCurrencies={['MATIC']}
        // supportedCurrencies={['MATIC', 'USDC']}
        // paymentType={PaymentRequestType.PAYSTREAM}
        totalAmount={0.00001} // @TODO bug when also has normalizedPrice
      />
    </>
  );
};

export default App;
