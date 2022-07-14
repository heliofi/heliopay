## Installation

```yarn add @heliofi/react```


## Components

### 1. HelioPay

A container that gets all the payment informations.

```js
import { HelioPay } from '@heliofi/react';

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
| onSuccess    | function | no       |            | triggered event when success |
| onError    | function | no       |            | triggered event when error |
| onPending    | function | no       |            | triggered event when pending |
| onStartPayment    | function | no       |            | triggered event on start payment |

