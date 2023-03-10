import React from 'react';
import { Currency, Paystream } from '@heliofi/common';

import { FormikProps } from '../../baseCheckout/constants';
import { NumberInput, PriceBanner } from '../../../ui-kits';
import { formatTotalPrice } from '../../baseCheckout/actions';
import { useHelioProvider } from '../../../providers/helio/HelioContext';

export type PaystreamPricingProps = FormikProps & {
  activeCurrency: Currency | null;
  price: number;
};

const PaystreamPricing = ({
  formValues,
  setFieldValue,
  activeCurrency,
  price,
}: PaystreamPricingProps) => {
  const { getPaymentDetails } = useHelioProvider();
  const paymentDetails = getPaymentDetails<Paystream>();

  return (
    <div>
      {paymentDetails.maxTime && (
        <>
          <PriceBanner
            title={`Pay per ${paymentDetails.interval?.toLowerCase()}: `}
            amount={price}
            currency={activeCurrency?.symbol}
          />

          <NumberInput
            fieldId="interval"
            fieldName="interval"
            setFieldValue={(name, value) => {
              setFieldValue(name, value);
            }}
            value={formValues.interval}
            placeholder="Quantity"
            label={`Duration (${paymentDetails.interval?.toLowerCase()})`}
            required
          />

          <PriceBanner
            amount={formatTotalPrice(price, formValues.interval)}
            currency={activeCurrency?.symbol}
          />
        </>
      )}
    </div>
  );
};

export default PaystreamPricing;
