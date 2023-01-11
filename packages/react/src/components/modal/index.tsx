import React, { FC } from 'react';
import { ArrowsDoubleIcon, CrossIcon } from '@heliofi/helio-icons';
import {
  StyledModalCloseButton,
  StyledModalContainer,
  StyledModalContent,
  StyledModalHeader,
  StyledModalIcon,
  StyledModalTitle,
  StyledModalWrapper,
  StyledSwapButton,
} from './styles';

export type InheritedModalProps = {
  onHide: () => void;
};

type ModalProps = {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  animateIcon?: boolean;
  showSwap?: boolean;
  toggleSwap?: () => void;
};

export const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  onHide,
  children,
  icon,
  showSwap,
  toggleSwap,
  animateIcon = false,
}) => (
  <StyledModalWrapper>
    <StyledModalContainer>
      <StyledModalHeader>
        {icon && <StyledModalIcon spin={animateIcon}>{icon}</StyledModalIcon>}
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        {showSwap && (
          <StyledSwapButton onClick={toggleSwap}>
            <div>
              <ArrowsDoubleIcon fill="#FFF" />
              <p>SWAP</p>
            </div>
          </StyledSwapButton>
        )}
        <StyledModalCloseButton onClick={onHide}>
          <CrossIcon />
        </StyledModalCloseButton>
      </StyledModalHeader>
      <StyledModalContent>{children}</StyledModalContent>
    </StyledModalContainer>
  </StyledModalWrapper>
);

export default Modal;
