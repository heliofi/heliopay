import { BasePaymentProps } from '../models/PaymentProps';
import { BasePaymentService } from '../BasePaymentService';
import { BasePaymentResponse } from '../models/PaymentResponse';
import { BaseTransactionPayload } from '../models/TransactionPayload';

export abstract class BasePaystreamService<
  T,
  P extends BaseTransactionPayload,
  K extends BasePaymentProps<L>,
  L extends BasePaymentResponse
> extends BasePaymentService<T, P, K, L> {
  protected dateToTimeStamp(date: Date): number {
    return Math.floor(date.getTime() / 1000) + 1;
  }
}
