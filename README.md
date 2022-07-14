## Installation

```yarn add @heliofi/react```


## Components

### 1. HelioPay

A container that gets all the payment informations.

```js
import React, { useState } from 'react';

const App = () => {
    return (
        <div>
            <HelioPay
                cluster="devnet"
                paymentRequestId={"your_paylink_id"}
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
        />
      </div>
    )
}
```

| Property | Type   | Required | Default value | Description  |
| :------- | :----- | :------- | :------------ | :----------- |
| cluster    | string | yes      |         | **available values;** devnet, mainnet-beta, testnet |
| paymentRequestId    | string | yes       |            | Your paylink ID |
| onSuccess    | function | yes       |            | triggered event when success |
| onError    | function | yes       |            | triggered event when error |
| onPending    | function | yes       |            | triggered event when pending |
| onStartPayment    | function | yes       |            | triggered event on start payment |

