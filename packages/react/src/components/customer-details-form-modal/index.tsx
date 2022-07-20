import ReactDOM from 'react-dom';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { Modal, InheritedModalProps } from '../modal';
import validationSchema from '../heliopay-container/validation-schema';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import Input from '../input';
import Button from '../button';
import {
  StyledCurrency,
  StyledCurrencySelectIcon,
  StyledFormText,
  StyledFormTitle,
  StyledPrice,
} from './styles';
import SelectBox from '../selectbox';
import { countries } from '../../domain/constants/countries';
import { removeUndefinedFields } from '../../utils';
import { Currency, CustomerDetails } from '../../domain';
import NumberInput from '../numberInput';
import CurrencyIcon from '../currency-icon';

interface Props extends InheritedModalProps {
  onSubmit: (data: {
    amount: number;
    customerDetails?: CustomerDetails;
    quantity: number;
    currency: Currency;
  }) => void;
  allowedCurrencies?: Currency[] | null;
  totalAmount?: number;
}

const CustomerDetailsFormModal = ({
  onHide,
  onSubmit,
  allowedCurrencies,
  totalAmount,
}: Props) => {
  const { currencyList, paymentDetails } = useHelioProvider();
  const [normalizedPrice, setNormalizedPrice] = useState(0);
  const [currency, setCurrency] = useState<Currency | null>(null);

  const canSelectCurrency =
    allowedCurrencies?.length != null && allowedCurrencies?.length > 1;

  const currenciesOptions = allowedCurrencies?.map((currency: Currency) => ({
    label: currency?.symbol ?? '',
    value: currency?.symbol ?? '',
    icon: <CurrencyIcon gradient iconName={currency.symbol ?? ''} />,
  }));

  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.code,
  }));

  const getCurrency = (currency?: string) => {
    if (!currency) return;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  useEffect(() => {
    if (allowedCurrencies?.length === 1) {
      setCurrency(allowedCurrencies[0]);
    } else if (!canSelectCurrency) {
      setCurrency(getCurrency(paymentDetails.currency));
    }
  }, [paymentDetails?.currency, canSelectCurrency]);

  useEffect(() => {
    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      setNormalizedPrice(
        TokenConversionService.convertFromMinimalUnits(
          getCurrency(paymentDetails.currency),
          paymentDetails.normalizedPrice
        )
      );
    }
  }, [paymentDetails]);

  const formatTotalPrice = (price: number, quantity = 1): number => {
    const totalPrice = Number((price * quantity).toFixed(3));
    return totalPrice || price;
  };

  const isCustomerDetailsRequired = (): boolean => {
    if (!paymentDetails) return false;
    return (
      paymentDetails.requireEmail ||
      paymentDetails.requireFullName ||
      paymentDetails.requireDiscordUsername ||
      paymentDetails.requireTwitterUsername ||
      paymentDetails.requireCountry ||
      paymentDetails.requireDeliveryAddress
    );
  };
  const initialValues = {
    requireEmail: paymentDetails.requireEmail,
    requireDiscordUsername: paymentDetails.requireDiscordUsername,
    requireFullName: paymentDetails.requireFullName,
    requireTwitterUsername: paymentDetails.requireTwitterUsername,
    requireCountry: paymentDetails.requireCountry,
    requireDeliveryAddress: paymentDetails.requireDeliveryAddress,
    canChangePrice: paymentDetails.canChangePrice,
    canChangeQuantity: paymentDetails.canChangeQuantity,
    fullName: undefined,
    email: undefined,
    discordUsername: undefined,
    twitterUsername: undefined,
    country: undefined,
    deliveryAddress: undefined,
    quantity: paymentDetails.canChangeQuantity ? 1 : undefined,
    customPrice: paymentDetails.canChangePrice ? undefined : normalizedPrice,
    canSelectCurrency,
    currency: canSelectCurrency ? undefined : paymentDetails.currency,
  };

  const handleSubmit = (values: any) => {
    const details = {
      fullName: values.fullName,
      email: values.email,
      discordUsername: values.discordUsername,
      twitterUsername: values.twitterUsername,
      country: values.country,
      deliveryAddress: values.deliveryAddress,
    };

    const clearDetails = removeUndefinedFields(details);

    onSubmit({
      customerDetails: clearDetails,
      amount: TokenConversionService.convertToMinimalUnits(
        getCurrency(values.currency),
        values.canChangePrice
          ? values.customPrice
          : totalAmount || normalizedPrice
      ),
      quantity: values.quantity || 1,
      currency: values.currency || paymentDetails?.currency,
    });
  };

  return ReactDOM.createPortal(
    <div>
      <Modal
        onHide={onHide}
        icon={
          currency && (
            <CurrencyIcon gradient iconName={currency?.symbol || ''} />
          )
        }
        title={currency ? `Pay with ${currency?.symbol}` : 'Pay'}
      >
        {paymentDetails ? (
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div>
                  {values.canChangePrice ? (
                    <Input
                      fieldId="customPrice"
                      fieldName="customPrice"
                      label="Name your own price"
                      prefix={currency?.sign}
                      suffix={
                        currency && (
                          <StyledCurrency>
                            <p>{currency.symbol}</p>
                            <CurrencyIcon
                              gradient
                              iconName={currency?.symbol || ''}
                            />
                          </StyledCurrency>
                        )
                      }
                    />
                  ) : (
                    <StyledPrice>
                      Total price:{' '}
                      <b>
                        {formatTotalPrice(
                          totalAmount || normalizedPrice,
                          values.quantity
                        )}{' '}
                        {values.currency}
                      </b>
                    </StyledPrice>
                  )}
                  {canSelectCurrency && (
                    <SelectBox
                      options={currenciesOptions || []}
                      placeholder="Select currency"
                      value={values.currency}
                      showValidations
                      fieldName="currency"
                      label="Currency"
                      prefix={
                        values.currency && (
                          <StyledCurrencySelectIcon>
                            <CurrencyIcon gradient iconName={values.currency} />
                          </StyledCurrencySelectIcon>
                        )
                      }
                      onChange={(option) => {
                        setFieldValue('currency', option.value);
                        setCurrency(getCurrency(option.value as string));
                      }}
                    />
                  )}
                  {paymentDetails?.canChangeQuantity && (
                    <NumberInput
                      fieldId="quantity"
                      fieldName="quantity"
                      setFieldValue={setFieldValue}
                      value={values.quantity}
                      placeholder="Quantity"
                      label="Quantity"
                    />
                  )}
                  {isCustomerDetailsRequired() && (
                    <>
                      <StyledFormTitle>Information required</StyledFormTitle>
                      <StyledFormText>
                        We need some information from you to deliver the
                        product.
                      </StyledFormText>
                    </>
                  )}
                  {paymentDetails.requireFullName && (
                    <Input
                      fieldId="fullName"
                      fieldName="fullName"
                      placeholder="Full name"
                      label="Full name"
                    />
                  )}

                  {paymentDetails.requireEmail && (
                    <Input
                      fieldId="email"
                      fieldName="email"
                      placeholder="john@helio.co"
                      label="E-mail address"
                    />
                  )}

                  {paymentDetails.requireTwitterUsername && (
                    <Input
                      fieldId="twitterUsername"
                      fieldName="twitterUsername"
                      placeholder="@helio_pay"
                      label="Twitter username"
                    />
                  )}

                  {paymentDetails.requireDiscordUsername && (
                    <Input
                      fieldId="discordUsername"
                      fieldName="discordUsername"
                      placeholder="Helio#1234"
                      label="Discord username"
                    />
                  )}

                  {paymentDetails.requireCountry && (
                    <SelectBox
                      options={countryOptions}
                      placeholder="Select country"
                      value={values.country}
                      showValidations
                      fieldName="country"
                      label="Country"
                      onChange={(option) =>
                        setFieldValue('country', option.label)
                      }
                    />
                  )}

                  {paymentDetails.requireDeliveryAddress && (
                    <Input
                      fieldId="deliveryAddress"
                      fieldName="deliveryAddress"
                      fieldAs="textarea"
                      placeholder="Shipping address"
                      label="Shipping address"
                    />
                  )}
                  <Button type="submit">PAY</Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <h2>Failed to load payment details.</h2>
        )}
      </Modal>
    </div>,
    document.body
  );
};

export default CustomerDetailsFormModal;
