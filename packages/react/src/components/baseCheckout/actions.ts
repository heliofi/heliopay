import { FormikValues } from 'formik';
import { CustomerDetails, ProductDetails } from '@heliofi/common';

import { IHandleSubmit } from './constants';
import { removeUndefinedFields } from '../../utils';

export const getInitialValues = (
  paymentDetails: any,
  normalizedPrice: number,
  canSelectCurrency: boolean,
  initialCurrency?: string
) => ({
  requireEmail: paymentDetails?.features.requireEmail,
  requireDiscordUsername: paymentDetails?.features.requireDiscordUsername,
  requireFullName: paymentDetails?.features.requireFullName,
  requireTwitterUsername: paymentDetails?.features.requireTwitterUsername,
  requirePhoneNumber: paymentDetails?.features.requirePhoneNumber,
  requireCountry: paymentDetails?.features.requireCountry,
  requireDeliveryAddress: paymentDetails?.features.requireDeliveryAddress,
  requireProductDetails: paymentDetails?.features.requireProductDetails,
  canChangePrice: paymentDetails?.features.canChangePrice,
  canChangeQuantity: paymentDetails?.features.canChangeQuantity,
  fullName: undefined,
  email: undefined,
  discordUsername: undefined,
  twitterUsername: undefined,
  country: undefined,
  areaCode: '',
  deliveryAddress: undefined,
  city: undefined,
  street: undefined,
  streetNumber: undefined,
  phoneNumber: undefined,
  quantity: paymentDetails?.features.canChangeQuantity ? 1 : undefined,
  customPrice: paymentDetails?.features.canChangePrice
    ? undefined
    : normalizedPrice,
  canSelectCurrency,
  currency: canSelectCurrency ? undefined : initialCurrency,
  productValue: undefined,
});

export const getCurrency = (currencyList: any[], currency?: string) => {
  if (!currency) return null;
  return currencyList.find((c: any) => c.symbol === currency);
};

export const handleSubmit =
  ({
    paymentDetails,
    HelioSDK,
    price,
    onSubmit,
    currencyList,
  }: IHandleSubmit) =>
  (values: FormikValues) => {
    const details = {
      fullName: values.fullName,
      email: values.email,
      discordUsername: values.discordUsername,
      twitterUsername: values.twitterUsername,
      country: values.country,
      deliveryAddress: values.deliveryAddress,
      city: values.city,
      street: values.street,
      streetNumber: values.streetNumber,
      areaCode: values.areaCode,
      phoneNumber: values.phoneNumber,
    };

    const productDetails = {
      name: paymentDetails?.product?.name,
      value: values.productValue,
    };

    const clearDetails = removeUndefinedFields<CustomerDetails>(details);
    const clearProductDetails =
      removeUndefinedFields<ProductDetails>(productDetails);

    onSubmit({
      customerDetails: clearDetails,
      productDetails: clearProductDetails,
      amount: HelioSDK.tokenConversionService.convertToMinimalUnits(
        values.currency || paymentDetails?.currency.symbol,
        values.canChangePrice ? values.customPrice : price
      ),
      quantity: values.quantity || 1,
      currency: getCurrency(
        currencyList,
        values.currency || paymentDetails?.currency.symbol
      ),
    });
  };

export const formatTotalPrice = (price: number, quantity = 1): number => {
  const totalPrice = Number((price * quantity).toFixed(3));
  return totalPrice || price;
};
