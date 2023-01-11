import styled from 'styled-components';
import Button from '../button';

export const StyledModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 120px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export const StyledModalContainer = styled.div`
  width: 400px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(156, 163, 175, 0.15);
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 50px;
`;

export const StyledModalIcon = styled.div<{ spin?: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  ${({ spin }) =>
    spin &&
    `
    animation: spin 1s linear infinite;
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}

  svg,
  img,
  div {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const StyledModalTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  color: #5a6578;
`;

export const StyledSwapButton = styled(Button)`
  width: unset;
  height: 30px;
  position: absolute;
  right: 32px;
  line-height: unset;
  padding: 3px 7px;

  div {
    display: flex;
    align-items: center;
  }

  path {
    fill: #fff;
  }
`;

export const StyledModalCloseButton = styled.div`
  position: absolute;
  top: 0;
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

export const StyledModalContent = styled.div`
  padding-top: 20px;
`;
