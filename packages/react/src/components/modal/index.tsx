import React, { FC } from 'react';
import CloseGray from '../icons/CloseGray';
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
  closeOnClickOutside?: boolean;
};

export const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  onHide,
  children,
  icon,
  closeOnClickOutside = false,
}) => (
  <StyledModalWrapper>
    <StyledModalContainer>
      <StyledModalHeader>
        {icon && <StyledModalIcon>{icon}</StyledModalIcon>}
        {title && <StyledModalTitle>{title}</StyledModalTitle>}
        <StyledModalCloseButton onClick={onHide}>
          <CloseGray />
        </StyledModalCloseButton>
      </StyledModalHeader>
      <StyledModalContent>{children}</StyledModalContent>
    </StyledModalContainer>
  </StyledModalWrapper>
);

export default Modal;
