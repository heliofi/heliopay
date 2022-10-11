import React, { useEffect, useState } from 'react';
import {
  ErrorPaymentEvent,
  HelioPay,
  PendingPaymentEvent,
  SuccessPaymentEvent,
  HelioApiAdapter,
} from '@heliofi/react';

import './styles/style.scss';

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    '6336b9352d7e2da5e52a8e2f'
  );

  const getListCurrencies = () => {
    HelioApiAdapter.listCurrencies()
      .then((res) => {
        // console.log(2, res);
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  useEffect(() => {
    getListCurrencies()
  }, []);

  return (
    <>
      <input
        type="text"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <HelioPay
        cluster="mainnet-beta"
        theme={{
          colors: {
            primary: '#770d5a',
          }
        }}
        paymentRequestId={paymentId}
        onSuccess={function (event: SuccessPaymentEvent): void {
          console.log('onSuccess', event);
        }}
        onError={function (event: ErrorPaymentEvent): void {
          console.log('onError', event);
        }}
        onPending={function (event: PendingPaymentEvent): void {
          console.log('onPending', event);
        }}
        onStartPayment={function (): void {
          console.log('onStartPayment');
        }}
        supportedCurrencies={['SOL']}
        totalAmount={0.01}
      />
    </>
  );
};

export default App;
