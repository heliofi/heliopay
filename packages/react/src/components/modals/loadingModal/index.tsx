import React from 'react';
import ReactDOM from 'react-dom';

import { LoadingModalStep } from '@heliofi/sdk';

import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { CurrencyIcon, Icon } from '../../../ui-kits';
import { DefaultContent } from './content/defaultContent';
import { FinalStepContent } from './content/finalStepContent';
import { PermissionRequireStepContent } from './content/permissionRequireStepContent';
import { SubmitTransactionStepContent } from './content/submitTransactionStepContent';
import { useCompositionRoot } from '../../../hooks/compositionRoot';
import Modal, { InheritedModalProps } from '../index';
import {
  StyledLoadingModalBody,
  StyledLoadingModalBodyFooter,
  StyledLoadingModalBodyIcons,
  StyledLoadingModalBodyIconsCount,
  StyledLoadingModalBodyIconsText,
  StyledLoadingModalBodyNewToHelio,
  StyledLoadingModalWrapper,
} from './styles';

export type LoadingModalProps = InheritedModalProps & {
  step?: LoadingModalStep;
  totalSteps?: number;
};

const LoadingModal = ({
  onHide,
  step = LoadingModalStep.DEFAULT,
  totalSteps = 0,
}: LoadingModalProps) => {
  const { HelioSDK } = useCompositionRoot();
  const { currencyList } = useHelioProvider();

  const { defaultCurrencyService } = HelioSDK;

  const displayedCurrenciesCount = 3;
  const optionalCurrenciesCount =
    currencyList.length - displayedCurrenciesCount;

  const getModalContent = (): JSX.Element | undefined => {
    switch (step) {
      case LoadingModalStep.GET_PERMISSION:
        return <PermissionRequireStepContent totalSteps={totalSteps} />;
      case LoadingModalStep.SIGN_TRANSACTION:
        return <SubmitTransactionStepContent totalSteps={totalSteps} />;
      case LoadingModalStep.SUBMIT_TRANSACTION:
        return <FinalStepContent totalSteps={totalSteps} />;
      case LoadingModalStep.DEFAULT:
        return <DefaultContent />;
      case LoadingModalStep.CLOSE:
      default:
        return undefined;
    }
  };

  return ReactDOM.createPortal(
    <StyledLoadingModalWrapper>
      <Modal onHide={onHide}>
        <Icon iconName="Helio" className="loading-modal-header-icon" />

        <StyledLoadingModalBody>
          {getModalContent()}
          <StyledLoadingModalBodyFooter>
            <a href="https://docs.hel.io" target="_blank" rel="noreferrer">
              <StyledLoadingModalBodyNewToHelio>
                New to helio?
              </StyledLoadingModalBodyNewToHelio>
            </a>
            <StyledLoadingModalBodyIcons>
              <StyledLoadingModalBodyIconsText>
                We accept
              </StyledLoadingModalBodyIconsText>
              <CurrencyIcon
                iconName={defaultCurrencyService.getDefaultCurrencySymbol()}
              />
              <CurrencyIcon
                iconName={defaultCurrencyService.getSolCurrencySymbol()}
              />
              <CurrencyIcon
                iconName={defaultCurrencyService.getEthCurrencySymbol()}
              />
              <StyledLoadingModalBodyIconsCount>
                <span>+{optionalCurrenciesCount}</span>
              </StyledLoadingModalBodyIconsCount>
            </StyledLoadingModalBodyIcons>
          </StyledLoadingModalBodyFooter>
        </StyledLoadingModalBody>
      </Modal>
    </StyledLoadingModalWrapper>,
    document.body
  );
};

export default LoadingModal;
