import styled from '../styledComponents';
import { rgba } from '../../utils';

export const StyledButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  border: none;
  box-shadow: 0 4px 12px ${(props) => rgba(props.theme.colors.primary, 0.4)};
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
    background: #ececec;
    color: #9ca3af;
    box-shadow: unset;

    &:hover {
      background: #a9b3c4;
      color: #fff;
    }
  }
`;
