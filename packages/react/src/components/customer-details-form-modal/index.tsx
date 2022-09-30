import ReactDOM from 'react-dom';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
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
  const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);

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

  const getCurrency = (currency?: string) : Currency | null => {
    if (!currency) return null;
    return currencyList.find((c: Currency) => c.symbol == currency) ?? null;
  };

  useEffect(() => {
    if (allowedCurrencies?.length === 1) {
      setActiveCurrency(allowedCurrencies[0]);
    } else if (!canSelectCurrency && paymentDetails?.currency.symbol != null) {
      setActiveCurrency(getCurrency(paymentDetails.currency.symbol));
    }
  }, [paymentDetails?.currency, canSelectCurrency]);

  useEffect(() => {
    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      console.log("paymentDetails?.currency", paymentDetails?.currency)
      setNormalizedPrice(
        TokenConversionService.convertFromMinimalUnits(
          getCurrency(paymentDetails.currency.symbol),
          Number(paymentDetails.normalizedPrice)
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
      paymentDetails.features.requireEmail ||
      paymentDetails.features.requireFullName ||
      paymentDetails.features.requireDiscordUsername ||
      paymentDetails.features.requireTwitterUsername ||
      paymentDetails.features.requireCountry ||
      paymentDetails.features.requireDeliveryAddress
    );
  };

  const initialValues = {
    requireEmail: paymentDetails?.features.requireEmail,
    requireDiscordUsername: paymentDetails?.features.requireDiscordUsername,
    requireFullName: paymentDetails?.features.requireFullName,
    requireTwitterUsername: paymentDetails?.features.requireTwitterUsername,
    requireCountry: paymentDetails?.features.requireCountry,
    requireDeliveryAddress: paymentDetails?.features.requireDeliveryAddress,
    canChangePrice: paymentDetails?.features.canChangePrice,
    canChangeQuantity: paymentDetails?.features.canChangeQuantity,
    fullName: undefined,
    email: undefined,
    discordUsername: undefined,
    twitterUsername: undefined,
    country: undefined,
    deliveryAddress: undefined,
    quantity: paymentDetails?.features.canChangeQuantity ? 1 : undefined,
    customPrice: paymentDetails?.features.canChangePrice ? undefined : normalizedPrice,
    canSelectCurrency,
    currency: canSelectCurrency ? undefined : paymentDetails?.currency.symbol,
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

    console.log(values.currency);

    onSubmit({
      customerDetails: clearDetails,
      amount: TokenConversionService.convertToMinimalUnits(
        getCurrency(values.currency ?? paymentDetails?.currency.symbol),
        values.canChangePrice
          ? values.customPrice
          : totalAmount ?? paymentDetails
      ),
      quantity: values.quantity ?? 1,
      currency: values.currency ?? paymentDetails?.currency,
    });

    console.log('soetuhnoehusna')
  };

  const symbol = activeCurrency ? `Pay with ${activeCurrency?.symbol}` : 'Pay';

  return ReactDOM.createPortal(
    <div>
      <Modal
        onHide={onHide}
        icon={
          activeCurrency && (
            <CurrencyIcon gradient iconName={activeCurrency?.symbol || ''} />
          )
        }
        title={symbol}
      >
        {paymentDetails ? (
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isValid }) => (
              <Form>
                <div>
                  {values.canChangePrice ? (
                    <Input
                      fieldId="customPrice"
                      fieldName="customPrice"
                      label="Name your own price"
                      prefix={activeCurrency?.sign}
                      suffix={
                        activeCurrency && (
                          <StyledCurrency>
                            <p>{activeCurrency.symbol}</p>
                            <CurrencyIcon
                              gradient
                              iconName={activeCurrency?.symbol || ''}
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
                        {activeCurrency?.symbol}
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
                        setActiveCurrency(getCurrency(option.value as string));
                      }}
                    />
                  )}
                  {paymentDetails.features.canChangeQuantity && (
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
                  {paymentDetails.features.requireFullName && (
                    <Input
                      fieldId="fullName"
                      fieldName="fullName"
                      placeholder="Full name"
                      label="Full name"
                    />
                  )}

                  {paymentDetails.features.requireEmail && (
                    <Input
                      fieldId="email"
                      fieldName="email"
                      placeholder="john@helio.co"
                      label="E-mail address"
                    />
                  )}

                  {paymentDetails.features.requireTwitterUsername && (
                    <Input
                      fieldId="twitterUsername"
                      fieldName="twitterUsername"
                      placeholder="@helio_pay"
                      label="Twitter username"
                    />
                  )}

                  {paymentDetails.features.requireDiscordUsername && (
                    <Input
                      fieldId="discordUsername"
                      fieldName="discordUsername"
                      placeholder="Helio#1234"
                      label="Discord username"
                    />
                  )}

                  {paymentDetails.features.requireCountry && (
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

                  {paymentDetails.features.requireDeliveryAddress && (
                    <Input
                      fieldId="deliveryAddress"
                      fieldName="deliveryAddress"
                      fieldAs="textarea"
                      placeholder="Shipping address"
                      label="Shipping address"
                    />
                  )}
                  <Button disabled={!isValid} type="submit">PAY</Button>
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
