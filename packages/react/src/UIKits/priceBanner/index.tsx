import React from 'react';
import { ConfigService } from '@heliofi/sdk/src/domain';
import { StyledPriceBanner, StyledTitle, StyledPrice } from './styles';

export type PriceBannerProps = {
  title?: string;
  amount: number;
  currency: string | undefined;
};

const PriceBanner = ({ title, amount, currency }: PriceBannerProps) => (
  <StyledPriceBanner>
    {title && <StyledTitle>{title}</StyledTitle>}{' '}
    <StyledPrice>
      {currency === ConfigService.CURRENCY_USDC ? '$' : ''}
      {amount} {currency}
    </StyledPrice>
  </StyledPriceBanner>
);

export default PriceBanner;
