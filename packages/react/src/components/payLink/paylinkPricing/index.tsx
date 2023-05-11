import React from 'react';
import { Currency, LinkFeaturesDto } from '@heliofi/common';

import {
  Input,
  CurrencyIcon,
  PriceBanner,
  SelectBox,
  NumberInput,
} from '../../../ui-kits';
import { FormikProps } from '../../baseCheckout/constants';
import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { formatTotalPrice } from '../../baseCheckout/actions';

import { StyledCurrency, StyledCurrencySelectIcon } from './styles';

export type PaylinkPricingProps = FormikProps & {
  totalDecimalAmount: number;
  canSelectCurrency: boolean;
  supportedAllowedCurrencies: Currency[];
};

const PaylinkPricing = ({
  formValues,
  setFieldValue,
  totalDecimalAmount,
  canSelectCurrency,
  supportedAllowedCurrencies,
}: PaylinkPricingProps) => {
  const { getPaymentFeatures, activeCurrency, initActiveCurrency } =
    useHelioProvider();

  const currenciesOptions = supportedAllowedCurrencies.map(
    (currency: Currency) => ({
      label: currency?.symbol ?? '',
      value: currency?.symbol ?? '',
      icon: <CurrencyIcon gradient iconName={currency.symbol ?? ''} />,
    })
  );

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
          totalDecimalAmount={formatTotalPrice(
            totalDecimalAmount,
            formValues.quantity
          )}
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
            initActiveCurrency(option.value as string);
          }}
        />
      )}

      {getPaymentFeatures<LinkFeaturesDto>()?.canChangeQuantity && (
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
