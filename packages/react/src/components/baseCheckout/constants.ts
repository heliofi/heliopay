import { FormikValues } from 'formik';
import { Currency } from '@heliofi/common';
import { HelioSDK as HelioSDKType } from '@heliofi/sdk';
import { SubmitPaymentsTypesProps } from '../heliopayContainer/constants';

export type InheritedOnSubmit = (
  data: SubmitPaymentsTypesProps
) => Promise<void>;

export type InheritedBaseCheckoutProps = {
  onHide: () => void;
  onSubmit: InheritedOnSubmit;
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
  onSubmit: InheritedOnSubmit;
  currencyList: Currency[];
}
