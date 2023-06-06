import styled from '../../ui-kits/styledComponents';

export const StyledTabWrapper = styled.div`
  display: flex;
  border: 1px solid #5a6578;
  border-radius: 8px;
  align-items: stretch;
  overflow: hidden;
`;

export const StyledTabItem = styled.div<{
  active: boolean;
  disabled: boolean | undefined;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 12px;
  text-align: center;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  ${({ active }) => active && 'font-weight: 700;'}
  ${({ active }) =>
    active
      ? `
         background: #5A6578 !important;
         color: #ffffff !important;
         `
      : `
        background: #ffffff !important;
        color: #808B9D !important;
      `}
  
  ${({ disabled }) => disabled && 'cursor: not-allowed;'}
`;
