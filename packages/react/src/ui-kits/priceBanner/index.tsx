import React from 'react';
import { CurrencySymbols } from '@heliofi/sdk';

import {
  StyledPriceBanner,
  StyledTitle,
  StyledPrice,
  StyledPriceBannerWrapper,
  StyledPriceBannerLabel,
} from './styles';

export type PriceBannerProps = {
  label?: string;
  title?: string;
  amount: number;
  currency?: string;
};

const PriceBanner = ({ label, title, amount, currency }: PriceBannerProps) => (
  <StyledPriceBannerWrapper>
    <StyledPriceBannerLabel>{label}</StyledPriceBannerLabel>
    <StyledPriceBanner>
      {title && <StyledTitle>{title}</StyledTitle>}{' '}
      <StyledPrice>
        {currency === CurrencySymbols.USDC ? '$' : ''}
        {amount} {currency}
      </StyledPrice>
    </StyledPriceBanner>
  </StyledPriceBannerWrapper>
);

export default PriceBanner;
