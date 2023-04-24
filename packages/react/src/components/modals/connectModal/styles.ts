import styled from 'styled-components';

export const StyledConnectModalWrapper = styled.div`
  margin-top: 5px;
  margin-left: 2px;
  margin-right: 2px;
`;

export const StyledConnectModalTitle = styled.h2`
  color: #000000;
  margin-bottom: 17px;
  font-size: 16px;
  line-height: 1.75rem;
  font-weight: 700;
`;

export const StyledConnectModalTabs = styled.div`
  margin-bottom: 21px;
`;

export const StyledConnectModalSolanaInstalled = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 0.5rem;
`;

export const StyledConnectModalMoreOptions = styled.div`
  cursor: pointer;
  margin: 0.75rem 0;
`;

export const StyledConnectModalMoreOptionsBody = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;

  p {
    color: #f76c1b;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-decoration-line: underline;
  }

  p:hover {
    color: #cf5014;
  }
`;

export const StyledConnectModalMoreOptionsBodyIcon = styled.div`
  width: 1rem;
  height: 1rem;
`;

export const StyledConnectModalMoreOptionsList = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 0.5rem;
`;
