import { PaymentEvent } from "./PaymentEvent";
import type { ApproveTransactionResponse } from "../../infrastructure";

export interface SuccessPaymentEvent<T = ApproveTransactionResponse>
  extends PaymentEvent {
  data: T;
  transaction: string;
  paymentPK?: string;
  swapTransaction?: string;
}
