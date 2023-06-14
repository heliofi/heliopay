import React, { FC } from 'react';

import { CrossIcon } from '@heliofi/helio-icons';
import {
  StyledModalContainer,
  StyledModalContent,
  StyledModalHeader,
  StyledModalWrapper,
  StyledModalCloseButton,
  StyledModalIcon,
  StyledModalTitle,
} from './styles';

export type InheritedModalProps = {
  onHide?: () => void;
};

type ModalProps = {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  animateIcon?: boolean;
};

const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  icon,
  onHide,
  children,
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
