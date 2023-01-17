import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

export const StyledSpinner = styled.svg`
  color: #e5e7eb;
  fill: #f76c1b;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;
