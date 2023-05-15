import React from 'react';

import BaseCheckout from '../../baseCheckout';
import PaylinkPricing from '../paylinkPricing';
import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { InheritedBaseCheckoutProps } from '../../baseCheckout/constants';

type PaylinkCheckoutProps = InheritedBaseCheckoutProps & {
  supportedCurrencies?: string[];
};

const PaylinkCheckout = (props: PaylinkCheckoutProps) => {
  const { totalAmount, supportedCurrencies } = props;

  const { paymentDetails } = useHelioProvider();

  if (paymentDetails?.dynamic && !totalAmount) {
    throw new Error('You should pass totalAmount for dynamic payments');
  } else if (!paymentDetails?.dynamic && totalAmount) {
    throw new Error("You can't pass total amount for non dynamic payments");
  } else if (paymentDetails?.dynamic && !supportedCurrencies) {
    throw new Error(
      'You should pass supported currencies for dynamic payments'
    );
  } else if (!paymentDetails?.dynamic && supportedCurrencies) {
    throw new Error(
      "You can't pass supported currencies for non dynamic payments"
    );
  }

  return <BaseCheckout {...props} PricingComponent={PaylinkPricing} />;
};

export default PaylinkCheckout;
