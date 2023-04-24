import styled from 'styled-components';

export const StyledInstalledWalletsWrapper = styled.div`
  display: flex;
  height: 32px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
`;

export const StyledInstalledWalletsConnect = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`;

export const StyledInstalledWalletsTextWrapper = styled.div`
  background: #fff5e9;
  border-radius: 0.5rem;
  padding: 6px;
`;

export const StyledInstalledWalletsText = styled.p`
  color: #801a07;
  height: 20px;
  font-size: 16px;
`;

export const StyledInstalledWalletsButtonWrapper = styled.div`
  width: 32px;
  height: 32px;

  button {
    padding: 0.25rem;
    height: 32px;
  }
`;
