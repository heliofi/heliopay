import { FormikValues } from 'formik';
import { Currency, CustomerDetails, ProductDetails } from '@heliofi/common';
import { HelioSDK as HelioSDKType } from '@heliofi/sdk';

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

export type FormikSetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean
) => void;

export type FormikProps = {
  formValues: FormikValues;
  setFieldValue: FormikSetFieldValue;
};

export interface IHandleSubmit {
  paymentDetails?: any;
  HelioSDK: HelioSDKType;
  price: number;
  onSubmit: InheritedOnSumbit;
  currencyList: Currency[];
}
