import styled from 'styled-components';
import { Button } from '../../ui-kits';

export const StyledCHContainer = styled.div`
  border-bottom: 1px solid rgb(244 245 247);
`;

export const StyledCHImage = styled.div`
  background-image: linear-gradient(
    90deg,
    #d8d9f5,
    #feeef2 20%,
    #feede3 70%,
    #fffdf5
  );

  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

export const StyledCHHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 50px;
  margin: 24px;
`;

export const StyledCHIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;

  svg,
  img,
  div {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const StyledCHTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  color: #5a6578;
`;

export const StyledCHSwapButton = styled(Button)<{ isSwapShown: boolean }>`
  width: unset;
  height: 30px;
  position: absolute;
  right: 32px;
  line-height: unset;
  padding: 3px 7px;
  display: flex;
  align-items: center;

  path {
    fill: #ffffff;
  }

  &:hover {
    background-color: rgb(232 90 8 / 1);
    color: rgb(255 255 255 / 1);
    path {
      fill: #ffffff;
    }
  }

  ${({ isSwapShown, theme }) => `
    ${
      isSwapShown &&
      `background: #FFF5E9;
      color: ${theme.colors.primary};
      box-shadow: unset;
      path {
        fill: ${theme.colors.primary};
      }
      `
    };
  `}
`;

export const StyledCHCloseButton = styled.div`
  position: absolute;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: #9ca3af;
  }
`;
