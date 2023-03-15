import React, { useState } from 'react';
import { HelioPay } from '../../react';
import { SuccessPaymentEvent, ErrorPaymentEvent, PendingPaymentEvent } from '@heliofi/sdk'
import './styles/style.scss';
import { PaymentRequestType } from "@heliofi/common";
window.Buffer = window.Buffer || require('buffer').Buffer;

const App = () => {
  const [paymentId, setPaymentId] = useState<string | null>(
    '6411a15b205680c4734779c9'
  );

  return (
    <>
      <input
        type="text"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <HelioPay
        cluster="devnet"
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
        supportedCurrencies={['USDC', 'SOL']}
        paymentType={'PAYSTREAM' as PaymentRequestType}
        // totalAmount={0.01} // @TODO bug when also has normalizedPrice
      />
    </>
  );
};

export default App;
