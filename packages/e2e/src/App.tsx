import React from "react";
import HelloWorld from "components/HelloWorld";
import { SolanaProvider, OneTimePaymentButton, ErrorPaymentEvent, PendingPaymentEvent, SuccessPaymentEvent } from "@heliofi/react";

const App = () => {
  return <SolanaProvider>
    <OneTimePaymentButton amount={0} receiverSolanaAddress={""} paymentRequestId={""} onSuccess={function (event: SuccessPaymentEvent): void {
      throw new Error("Function not implemented.");
    } } onError={function (event: ErrorPaymentEvent): void {
      throw new Error("Function not implemented.");
    } } onPending={function (event: PendingPaymentEvent): void {
      throw new Error("Function not implemented.");
    } } isFormSubmitted={false} customerDetails={undefined} />

  </SolanaProvider>
};

export default App;
