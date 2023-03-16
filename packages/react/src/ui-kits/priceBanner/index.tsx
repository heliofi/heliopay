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
  totalDecimalAmount: number;
  currency?: string;
};

const PriceBanner = ({
  label,
  title,
  totalDecimalAmount,
  currency,
}: PriceBannerProps) => (
  <StyledPriceBannerWrapper>
    <StyledPriceBannerLabel>{label}</StyledPriceBannerLabel>
    <StyledPriceBanner>
      {title && <StyledTitle>{title}</StyledTitle>}{' '}
      <StyledPrice>
        {currency === CurrencySymbols.USDC ? '$' : ''}
        {totalDecimalAmount} {currency}
      </StyledPrice>
    </StyledPriceBanner>
  </StyledPriceBannerWrapper>
);

export default PriceBanner;
