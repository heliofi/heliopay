import styled from 'styled-components';

export const ContentProgressContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  gap: 0.625rem;
`;
export const ContentProgressItem = styled.div<{ active: boolean }>`
  height: 0.5rem;
  width: 2.5rem;
  border-radius: 0.5rem;

  ${({ active }) => `background: ${active ? `#F76C1B` : `#FFF5E9`} !important;`}
`;
