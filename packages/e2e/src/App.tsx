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
    '633e9e9b3ede004cd0b17d09'
  );

  const getListCurrencies = () => {
    HelioApiAdapter.listCurrencies('mainnet-beta')
      .then((res) => {
        // console.log(2, res);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    getListCurrencies();
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
        supportedCurrencies={['USDC']}
        totalAmount={1}
        additionalJSON={{
          eventId: 429029,
          tickets: [
            {
              ticketId: 273465,
              properties: {
                firstName: 'u',
                lastName: 'u',
                email: 'u@gmail.com',
                company: 'u',
                country: 'Andorra',
                event_info: 'Designer (UI, Product)',
                tshirt_size: 'Medium',
                ticket_refunds: true,
                ticket_transfers: true,
              },
            },
          ],
        }}
      />
    </>
  );
};

export default App;
