import React, { useState } from 'react';
import { StreamTimeService } from '@heliofi/sdk';
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
  setFieldValue,
  activeCurrency,
  price,
}: PaystreamPricingProps) => {
  const helioProvider = useHelioProvider();
  const paymentDetails = helioProvider.paymentDetails as Paystream;

  const streamInitialPrice = StreamTimeService.getInitialStreamTime({
    intervalType: paymentDetails.interval,
    durationSec: paymentDetails.maxTime,
  });

  const [maxTime, setMaxTime] = useState<number>(streamInitialPrice);

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
            fieldId="maxTime"
            fieldName="maxTime"
            setFieldValue={(name, value) => {
              setFieldValue(name, value);
              setMaxTime(value);
            }}
            value={maxTime}
            placeholder="Quantity"
            label={`Duration (${paymentDetails.interval?.toLowerCase()})`}
            required
          />

          <PriceBanner
            amount={formatTotalPrice(price, maxTime)}
            currency={activeCurrency?.symbol}
          />
        </>
      )}
    </div>
  );
};

export default PaystreamPricing;
