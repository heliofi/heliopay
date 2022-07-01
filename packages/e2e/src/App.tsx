import React, {useState} from "react";
import {
    SolanaProvider,
    HelioPayContainer,
    ErrorPaymentEvent,
    PendingPaymentEvent,
    SuccessPaymentEvent
} from "@heliofi/react";

const App = () => {
    const [paymentId, setPaymentId] = useState<string | null>(
        "ded08427-cbd4-4c9c-b29f-cd2c78e59f1c"
    );
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    return (
        <SolanaProvider>
            <input
                type="text"
                placeholder="Payment request ID"
                value={paymentId}
                onChange={(e: any) => {
                    setPaymentId(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    setIsFormSubmitted(true);
                }}
            >
                make payment
            </button>

            <HelioPayContainer
                buttonType={"button"}
                amount={1}
                currency="SOL"
                receiverSolanaAddress={"3guZfyRAE7dnn3jFdNMJjLxJDzaHHe893zXuiHF7PG6a"}
                paymentRequestId={paymentId}
                onSuccess={function (event: SuccessPaymentEvent): void {
                    console.log("onSuccess", {event});
                }}
                onError={function (event: ErrorPaymentEvent): void {
                    console.log("onError", {event});
                }}
                onPending={function (event: PendingPaymentEvent): void {
                    console.log("onPending", {event});
                }}
                isFormSubmitted={isFormSubmitted}
                customerDetails={undefined}
            />
            {/* <OneTimePaymentButton
                amount={1}
                currency="SOL"
                receiverSolanaAddress={"3guZfyRAE7dnn3jFdNMJjLxJDzaHHe893zXuiHF7PG6a"}
                paymentRequestId={"493a528a-686d-42b8-8949-f41d4a513567"}
                onSuccess={function (event: SuccessPaymentEvent): void {
                    console.log('onSuccess')
                }}
                onError={function (event: ErrorPaymentEvent): void {
                    console.log('onError')
                }}
                onPending={function (event: PendingPaymentEvent): void {
                    console.log('onPending')
                }}
                isFormSubmitted={false}
                customerDetails={undefined}
            /> */}
        </SolanaProvider>
    );
};

export default App;
