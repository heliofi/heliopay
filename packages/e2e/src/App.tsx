import React, {useState} from "react";
import {
    ErrorPaymentEvent,
    HelioPay,
    PendingPaymentEvent,
    SuccessPaymentEvent
} from "@heliofi/react";

import "./styles/style.scss";

const App = () => {
    const [paymentId, setPaymentId] = useState<string | null>(
        "17a8e277-b217-45b6-aa90-0b050ba3dd3d"
    );
    return (
        <HelioPay
            cluster="devnet"
            paymentRequestId={paymentId}
            onSuccess={function (event: SuccessPaymentEvent): void {
                console.log("onSuccess", event);
            }}
            onError={function (event: ErrorPaymentEvent): void {
                console.log("onError", event);
            }}
            onPending={function (event: PendingPaymentEvent): void {
                console.log("onPending", event);
            }}
            onStartPayment={function (): void {
                console.log("onStartPayment");
            }}
            // theme={{
            //     colors: {
            //         primary: "#ff0000",
            //         secondary: "#00ff00",
            //     }
            // }}
        />
    );
};

export default App;
