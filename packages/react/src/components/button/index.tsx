import { StyledButton } from './styles';

interface ButtonProps {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return <StyledButton>{children}</StyledButton>;
};

export default Button;
