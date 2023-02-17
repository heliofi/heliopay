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
} from './styles';

type ModalProps = {
  icon?: React.ReactNode;
  title: string;
  showSwap: boolean;
  isSwapShown: boolean;
  toggleSwap: () => void;
  onHide: () => void;
  showQRCode: boolean;
};

export const CheckoutHeader: FC<ModalProps> = ({
  icon,
  title,
  showSwap,
  isSwapShown,
  toggleSwap,
  onHide,
  showQRCode,
}) => (
  <StyledCHContainer>
    <StyledCHImage />
    <StyledCHHeader>
      {icon && <StyledCHIcon>{icon}</StyledCHIcon>}

      {title && <StyledCHTitle>{title}</StyledCHTitle>}

      {!showQRCode && showSwap && (
        <StyledCHSwapButton
          onClick={toggleSwap}
          isSwapShown={isSwapShown}
          type="button"
        >
          <ArrowsDoubleIcon />
          <span>SWAP</span>
        </StyledCHSwapButton>
      )}

      <StyledCHCloseButton onClick={onHide}>
        <CrossIcon />
      </StyledCHCloseButton>
    </StyledCHHeader>
  </StyledCHContainer>
);

export default CheckoutHeader;
