import React from 'react';

import BaseCheckout from '../../baseCheckout';
import PaylinkPricing from '../paylinkPricing';
import { InheritedBaseCheckoutProps } from '../../baseCheckout/constants';

type PaylinkCheckoutProps = InheritedBaseCheckoutProps;

const PaylinkCheckout = (props: PaylinkCheckoutProps) => (
  <BaseCheckout {...props} PricingComponent={PaylinkPricing} />
);

export default PaylinkCheckout;
