import React from 'react';

import { LoadingModalStep, LoadingModalStepsCount } from '@heliofi/sdk';
import { LoadingModalContentHeader, LoadingModalContentText } from '../styles';
import { ContentProgress } from '../contentProgress';
import {
  evmERC20TokenStepToIndex,
  evmNativeTokenStepToIndex,
  LoadingModalContentProps,
} from '../../shared';

export const SubmitTransactionStepContent = ({
  totalSteps,
}: LoadingModalContentProps) => {
  const activeIndex =
    totalSteps === LoadingModalStepsCount.EVM_NATIVE_TOKEN
      ? evmNativeTokenStepToIndex.get(LoadingModalStep.SIGN_TRANSACTION)
      : evmERC20TokenStepToIndex.get(LoadingModalStep.SIGN_TRANSACTION);

  return (
    <>
      <LoadingModalContentHeader>Confirming..</LoadingModalContentHeader>
      <ContentProgress totalSteps={totalSteps} activeStep={activeIndex} />
      <LoadingModalContentText>
        {activeIndex}. Confirm to submit transaction
      </LoadingModalContentText>
    </>
  );
};
