import React from 'react';
import BaseCheckout from '../baseCheckout';
import PaystreamPricing from '../paystreamPricing';

const PaystreamChekout = () => (
  <BaseCheckout PricingComponent={PaystreamPricing} />
);

export default PaystreamChekout;
