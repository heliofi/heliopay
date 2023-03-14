import React from 'react';

import BaseCheckout from '../../baseCheckout';
import PaystreamPricing from '../paystreamPricing';
import { InheritedBaseCheckoutProps } from '../../baseCheckout/constants';

type PaystreamChekoutProps = InheritedBaseCheckoutProps;

const PaystreamChekout = (props: PaystreamChekoutProps) => {
  const { totalAmount } = props;

  if (totalAmount) {
    throw new Error("You can't pass total amount for pay stream payments");
  }

  return <BaseCheckout {...props} PricingComponent={PaystreamPricing} />;
};

export default PaystreamChekout;
