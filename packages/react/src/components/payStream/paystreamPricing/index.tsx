import React from 'react';
import { Paystream } from '@heliofi/common';

import { timeUnitLabels } from '../time-units';
import { FormikProps } from '../../baseCheckout/constants';
import { NumberInput, PriceBanner } from '../../../ui-kits';
import { formatTotalPrice } from '../../baseCheckout/actions';
import { useHelioProvider } from '../../../providers/helio/HelioContext';

export type PaystreamPricingProps = FormikProps & {
  totalDecimalAmount: number;
};

const PaystreamPricing = ({
  formValues,
  setFieldValue,
  totalDecimalAmount,
}: PaystreamPricingProps) => {
  const { getPaymentDetails, activeCurrency } = useHelioProvider();
  const paymentDetails = getPaymentDetails<Paystream>();

  return (
    <div>
      {paymentDetails.maxTime && (
        <>
          <PriceBanner
            title={`Pay per ${timeUnitLabels[paymentDetails.interval]}: `}
            totalDecimalAmount={totalDecimalAmount}
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
            label={`Duration (${timeUnitLabels[paymentDetails.interval]})`}
            required
          />

          <PriceBanner
            label="Pre-approve total amount"
            totalDecimalAmount={formatTotalPrice(
              totalDecimalAmount,
              formValues.interval
            )}
            currency={activeCurrency?.symbol}
          />
        </>
      )}
    </div>
  );
};

export default PaystreamPricing;
