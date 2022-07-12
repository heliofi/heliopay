import styled from 'styled-components';

export const StyledConnectButtonWrapper = styled.div`
  display: inline-block;
  width: 100%;

  .wallet-adapter-button-trigger {
    background-color: ${(props) => props.theme.colors.primary};
    border: none;
    box-shadow: 0px 4px 12px rgba(247, 108, 27, 0.4);
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
