import React from 'react';

import BaseCheckout from '../../baseCheckout';
import PaystreamPricing from '../paystreamPricing';
import { InheritedBaseCheckoutProps } from '../../baseCheckout/constants';

type PaystreamChekoutProps = InheritedBaseCheckoutProps;

const PaystreamChekout = (props: PaystreamChekoutProps) => (
  <BaseCheckout {...props} PricingComponent={PaystreamPricing} />
);

export default PaystreamChekout;
