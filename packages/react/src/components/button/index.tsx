import { StyledButton } from './styles';

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, ...props }: ButtonProps) => (
  <StyledButton {...props}>{children}</StyledButton>
);

export default Button;
