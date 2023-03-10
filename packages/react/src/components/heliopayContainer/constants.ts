import { Currency, CustomerDetails, ProductDetails } from '@heliofi/common';

export type SubmitPaymentProps = {
  amount: bigint;
  currency: Currency;
  customerDetails?: CustomerDetails;
  productDetails?: ProductDetails;
};

export type SubmitPaymentPaylinkProps = SubmitPaymentProps & {
  quantity: bigint;
};

export type SubmitPaymentPaystreamProps = SubmitPaymentProps & {
  interval: number;
  maxTime: number;
};

export type SubmitPaymentsTypesProps =
  | SubmitPaymentPaylinkProps
  | SubmitPaymentPaystreamProps;
