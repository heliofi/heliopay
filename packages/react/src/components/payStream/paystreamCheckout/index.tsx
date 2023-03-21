import React from 'react';

import BaseCheckout from '../../baseCheckout';
import PaystreamPricing from '../paystreamPricing';
import { InheritedBaseCheckoutProps } from '../../baseCheckout/constants';

type PaystreamCheckoutProps = InheritedBaseCheckoutProps;

const PaystreamCheckout = (props: PaystreamCheckoutProps) => {
  const { totalAmount } = props;

  if (totalAmount) {
    throw new Error("You can't pass total amount for pay stream payments");
  }

  return <BaseCheckout {...props} PricingComponent={PaystreamPricing} />;
};

export default PaystreamCheckout;
