import styled from '../../../ui-kits/styledComponents';

export const StyledLoadingModalWrapper = styled.div`
  .loading-modal-header-icon {
    animation: spin 1s linear infinite !important;
    fill: #f76c1b;
    width: 1.75rem !important;
    height: 1.75rem !important;
    margin-left: 0.5rem !important;
    margin-right: 0.5rem !important;

    svg {
      width: 100%;
      height: 100%;
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

export const StyledLoadingModalBody = styled.div`
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
  margin-top: 3rem !important;
`;

export const StyledLoadingModalBodyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
`;

export const StyledLoadingModalBodyNewToHelio = styled.span`
  color: #f76c1b;
  text-decoration-line: underline;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const StyledLoadingModalBodyIcons = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`;

export const StyledLoadingModalBodyIconsText = styled.span`
  padding-right: 0.25rem;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #5a6578;
`;

export const StyledLoadingModalBodyIconsCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  background-color: rgb(229 231 235/1);
  border-radius: 9999px;
  width: 2.5rem;
  height: 1.5rem;

  span {
    color: #9ca3af;
    margin: 0;
    font-size: 0.75rem;
    line-height: 1rem;
  }
`;
