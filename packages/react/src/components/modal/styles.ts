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
  padding: 30px;
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
  width: 40px;
  height: 40px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledModalTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 125%;
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
  }
`;

export const StyledModalContent = styled.div`
  padding-top: 20px;
`;

