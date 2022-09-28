import ReactDOM from 'react-dom';
import HelioIcon from '../icons/HelioIcon';

import { Modal, InheritedModalProps } from '../modal';
import {
  StyledLoadingLink,
  StyledLoadingText,
  StyledLoadingTitle,
  StyledLoadingWrapper,
} from './styles';

export const LoadingModal = ({ onHide }: InheritedModalProps) =>
  ReactDOM.createPortal(
    <div>
      <Modal onHide={onHide} icon={<HelioIcon />} animateIcon>
        <StyledLoadingWrapper>
          <StyledLoadingTitle>Processing..</StyledLoadingTitle>
          <StyledLoadingText>Approving trasnsaction</StyledLoadingText>
        </StyledLoadingWrapper>
        <StyledLoadingLink
          href="https://docs.hel.io/"
          target="_blank"
          rel="noreferrer"
        >
          Need help?
        </StyledLoadingLink>
      </Modal>
    </div>,
    document.body
  );
