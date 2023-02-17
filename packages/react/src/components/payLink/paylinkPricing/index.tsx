import React from 'react';
import { Currency } from '@heliofi/common';

import {
  Input,
  CurrencyIcon,
  PriceBanner,
  SelectBox,
  NumberInput,
} from '../../../ui-kits';
import { FormikProps } from '../../baseCheckout/constants';
import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { formatTotalPrice, getCurrency } from '../../baseCheckout/actions';

import { StyledCurrency, StyledCurrencySelectIcon } from './styles';

type PaylinkPricingProps = FormikProps & {
  activeCurrency: Currency | null;
  price: number;
  canSelectCurrency: boolean;
  allowedCurrencies: Currency[];
  setActiveCurrency: (activeCurrency: Currency | null) => void;
};

const PaylinkPricing = ({
  formValues,
  setFieldValue,
  activeCurrency,
  price,
  canSelectCurrency,
  allowedCurrencies,
  setActiveCurrency,
}: PaylinkPricingProps) => {
  const { currencyList, paymentDetails } = useHelioProvider();

  const currenciesOptions = allowedCurrencies.map((currency: Currency) => ({
    label: currency?.symbol ?? '',
    value: currency?.symbol ?? '',
    icon: <CurrencyIcon gradient iconName={currency.symbol ?? ''} />,
  }));

  return (
    <>
      {formValues.canChangePrice ? (
        <Input
          fieldId="customPrice"
          fieldName="customPrice"
          setFieldValue={setFieldValue}
          label="Name your own price"
          required
          prefix={activeCurrency?.symbolPrefix}
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
        <PriceBanner
          title="Total price:"
          amount={formatTotalPrice(price, formValues.quantity)}
          currency={activeCurrency?.symbol}
        />
      )}

      {canSelectCurrency && (
        <SelectBox
          options={currenciesOptions || []}
          placeholder="Select currency"
          value={formValues.currency}
          showValidations
          fieldName="currency"
          label="Currency"
          prefix={
            formValues.currency && (
              <StyledCurrencySelectIcon>
                <CurrencyIcon gradient iconName={formValues.currency} />
              </StyledCurrencySelectIcon>
            )
          }
          onChange={(option) => {
            setFieldValue('currency', option.value);
            setActiveCurrency(
              getCurrency(currencyList, option.value as string)
            );
          }}
        />
      )}

      {paymentDetails?.features?.canChangeQuantity && (
        <NumberInput
          fieldId="quantity"
          fieldName="quantity"
          setFieldValue={setFieldValue}
          value={formValues.quantity}
          placeholder="Quantity"
          label="Quantity"
        />
      )}
    </>
  );
};

export default PaylinkPricing;
