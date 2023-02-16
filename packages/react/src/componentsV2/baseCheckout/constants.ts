import { Currency, CustomerDetails, ProductDetails } from '@heliofi/common';
import { FormikValues } from 'formik';

export type InheritedOnSumbit = (data: {
  amount: number;
  customerDetails?: CustomerDetails;
  productDetails?: ProductDetails;
  quantity: number;
  currency: Currency;
}) => void;

export type InheritedBaseCheckoutProps = {
  onHide: () => void;
  onSubmit: InheritedOnSumbit;
  allowedCurrencies: Currency[];
  totalAmount?: number;
};

export type FormikProps = {
  formValues: FormikValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
};
