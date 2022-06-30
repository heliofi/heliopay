import React from "react";
import {
    SolanaProvider,
    OneTimePaymentButton,
    HelioPayContainer,
    ErrorPaymentEvent,
    PendingPaymentEvent,
    SuccessPaymentEvent
} from "@heliofi/react";

const App = () => {
    return (
        <SolanaProvider>
            <HelioPayContainer
                buttonType={"button"}
                amount={1}
                currency="SOL"
                receiverSolanaAddress={"3guZfyRAE7dnn3jFdNMJjLxJDzaHHe893zXuiHF7PG6a"}
                paymentRequestId={"493a528a-686d-42b8-8949-f41d4a513567"}
                onSuccess={function (event: SuccessPaymentEvent): void {
                    throw new Error("Function not implemented.");
                }}
                onError={function (event: ErrorPaymentEvent): void {
                    throw new Error("Function not implemented.");
                }}
                onPending={function (event: PendingPaymentEvent): void {
                    throw new Error("Function not implemented.");
                }}
                isFormSubmitted={false}
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
