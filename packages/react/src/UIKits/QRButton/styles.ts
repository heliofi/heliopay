import styled from 'styled-components';

export const QRButtonWrapper = styled.div`
  display: flex;
  margin-right: 0;
  margin-left: auto;
  margin-top: 16px;
  width: fit-content;
  cursor: pointer;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  column-gap: 0.25rem;
  border-radius: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: #fff5e9ff;
  padding: 3px 0.5rem;

  &:hover {
    background-color: #ffead2ff;
  }
`;

export const StyledQRText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #a7350dff;
`;

export const StyledQRIcon = styled.div`
  width: 1rem;
  height: 1rem;
  fill: #f76c1b;
`;
