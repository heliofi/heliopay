import React from 'react';
import { CurrencySymbols } from '@heliofi/sdk';

import { StyledPriceBanner, StyledTitle, StyledPrice } from './styles';

export type PriceBannerProps = {
  title?: string;
  amount: number;
  currency?: string;
};

const PriceBanner = ({ title, amount, currency }: PriceBannerProps) => (
  <StyledPriceBanner>
    {title && <StyledTitle>{title}</StyledTitle>}{' '}
    <StyledPrice>
      {currency === CurrencySymbols.USDC ? '$' : ''}
      {amount} {currency}
    </StyledPrice>
  </StyledPriceBanner>
);

export default PriceBanner;
