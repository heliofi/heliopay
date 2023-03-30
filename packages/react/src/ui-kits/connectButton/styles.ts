import styled from 'styled-components';
import { rgba } from '../../utils';

export const StyledConnectButtonWrapper = styled.div`
  display: inline-block;
  width: 100%;

  .wallet-adapter-button-trigger {
    background-color: ${(props) => props.theme.colors.primary};
    border: none;
    box-shadow: 0 4px 12px ${(props) => rgba(props.theme.colors.primary, 0.4)};
    border-radius: 8px;
    color: #fff;
    padding: 12px;
    font-weight: 700;
    font-size: 14px;
    line-height: 125%;
    height: 48px;
    cursor: pointer;
    width: 100%;
    text-align: center;
    justify-content: center;

    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
`;
