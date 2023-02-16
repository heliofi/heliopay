import React, { FC } from 'react';
import { ArrowsDoubleIcon, CrossIcon } from '@heliofi/helio-icons';
import {
  StyledCHContainer,
  StyledCHImage,
  StyledCHHeader,
  StyledCHIcon,
  StyledCHTitle,
  StyledCHSwapButton,
  StyledCHCloseButton,
  StyledCHTickIcon,
} from './styles';
import CurrencyIcon from '../../components/currency-icon';

export const CheckoutHeader: FC = () => (
  <StyledCHContainer>
    <StyledCHImage />
    <StyledCHHeader>
      <StyledCHIcon>
        <CurrencyIcon gradient iconName="USDC" />
      </StyledCHIcon>
      <StyledCHTitle>Pay With USDC</StyledCHTitle>
      <StyledCHSwapButton>
        {/* <StyledCHTickIcon /> */}
        <ArrowsDoubleIcon fill="#FFF" />
        SWAP
      </StyledCHSwapButton>
      <StyledCHCloseButton>
        <CrossIcon />
      </StyledCHCloseButton>
    </StyledCHHeader>
  </StyledCHContainer>
);

export default CheckoutHeader;
