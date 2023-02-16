import styled from 'styled-components';

export const StyledBaseCheckoutWrapper = styled.div`
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

export const StyledBaseCheckoutContainer = styled.div`
  width: 400px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(156, 163, 175, 0.15);
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const StyledBaseCheckoutBody = styled.div`
  padding: 24px;
`;