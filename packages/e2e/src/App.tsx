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
        "2e3a9bed-4ea7-44b7-85c3-d708c4d5acea"
    );

    return (
        <>
            <input type="text" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
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
        </>
    );
};

export default App;
