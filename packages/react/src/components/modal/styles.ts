import styled from 'styled-components';

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
`;

export const StyledModalContainer = styled.div`
  width: 400px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(156, 163, 175, 0.15);
  border-radius: 8px;
`;

export const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 50px;
`;

export const StyledModalIcon = styled.div`
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

export const StyledModalTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  color: #5a6578;
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
