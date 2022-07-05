import React, {useState} from "react";
import {
    ErrorPaymentEvent,
    HelioPay,
    PendingPaymentEvent,
    SuccessPaymentEvent
} from "@heliofi/react";

import "./styles/style.scss";

const RECEIVER_SOL_ADDRESS = "3guZfyRAE7dnn3jFdNMJjLxJDzaHHe893zXuiHF7PG6a";

const App = () => {
    const [paymentId, setPaymentId] = useState<string | null>(
        "ded08427-cbd4-4c9c-b29f-cd2c78e59f1c"
    );
    return (
        <HelioPay
            receiverSolanaAddress={RECEIVER_SOL_ADDRESS}
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
