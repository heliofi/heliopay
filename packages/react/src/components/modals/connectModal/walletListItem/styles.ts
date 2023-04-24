import styled from 'styled-components';

export const StyledWalletListItemWrapper = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  column-gap: 1rem;
`;

export const StyledWalletListItemIcon = styled.div`
  img {
    width: 2rem;
    height: 2rem;
  }
`;

export const StyledWalletListItemText = styled.h4`
  color: #000000;
  font-size: 18px;
  font-weight: 700;
`;
