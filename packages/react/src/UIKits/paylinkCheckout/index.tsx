import React from 'react';
import BaseCheckout from '../baseCheckout';
import PaylinkPricing from '../paylinkPricing';

const PaylinkCheckout = () => (
  <BaseCheckout PricingComponent={PaylinkPricing} />
);

export default PaylinkCheckout;
