import styled from 'styled-components';

export const StyledPhantomRow = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border: 1px solid #ecececff;
  border-radius: 0.5rem;
  column-gap: 9px;
`;

export const StyledPhantomLogo = styled.div`
  position: relative;
  height: 32px;
  width: 32px;
  overflow: hidden;
  border-radius: 9999px;
  background-color: #ffffffff;

  & img {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    padding: 0;
    border: none;
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  }
`;
