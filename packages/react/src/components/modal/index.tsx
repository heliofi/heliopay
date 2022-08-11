import React, { FC } from 'react';
import { CrossIcon } from '@heliofi/helio-icons';
import {
  StyledModalCloseButton,
  StyledModalContainer,
  StyledModalContent,
  StyledModalHeader,
  StyledModalIcon,
  StyledModalTitle,
  StyledModalWrapper,
} from './styles';

export type InheritedModalProps = {
  onHide: () => void;
};

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  animateIcon?: boolean;
};

export const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  onHide,
  children,
  icon,
  animateIcon = false,
}) => (
  <StyledModalWrapper>
    <StyledModalContainer>
      <StyledModalHeader>
        {icon && <StyledModalIcon spin={animateIcon}>{icon}</StyledModalIcon>}
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        <StyledModalCloseButton onClick={onHide}>
          <CrossIcon />
        </StyledModalCloseButton>
      </StyledModalHeader>
      <StyledModalContent>{children}</StyledModalContent>
    </StyledModalContainer>
  </StyledModalWrapper>
);

export default Modal;
