import React from 'react';
import { StyledButton } from './styles';

export type ButtonProps = {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <StyledButton ref={ref} {...props}>
      {children}
    </StyledButton>
  )
);

export default Button;
