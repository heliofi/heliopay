import React, { useState } from 'react';
import {
  ClusterHelio,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '@heliofi/sdk';

import { HelioPay } from '@heliofi/react';

import './styles/style.scss';
import { BlockchainEngineType, PaymentRequestType } from '@heliofi/common';

window.Buffer = window.Buffer || require('buffer').Buffer;

// @TODO please don't review this file. This file only for development

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    '6463450b60755941ed524a0e'
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
        cluster={ClusterHelio.Mainnet}
        // customApiUrl="https://api.dev.hel.io/v1"
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
        supportedCurrencies={['SOL', 'USDC']}
        paymentType={PaymentRequestType.PAYLINK}
        blockchainEngine={BlockchainEngineType.EVM}
        totalAmount={0.001}
      />
    </>
  );
};

export default App;
