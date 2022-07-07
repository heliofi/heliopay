import styled from 'styled-components';

export const StyledButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  border: none;
  box-shadow: 0px 4px 12px rgba(247, 108, 27, 0.4);
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  line-height: 125%;
  width: 100%;
  height: 48px;
  cursor: pointer;
  user-select: none;
  &:disabled {
    cursor: not-allowed;
  }
`;
