import React from 'react';

import { LoadingModalStep, LoadingModalStepsCount } from '@heliofi/sdk';

import { LoadingModalContentHeader, LoadingModalContentText } from '../styles';
import {
  evmERC20TokenStepToIndex,
  evmNativeTokenStepToIndex,
  LoadingModalContentProps,
} from '../../shared';
import { ContentProgress } from '../contentProgress';

export const PermissionRequireStepContent = ({
  totalSteps,
}: LoadingModalContentProps) => {
  const activeIndex =
    totalSteps === LoadingModalStepsCount.EVM_NATIVE_TOKEN
      ? evmNativeTokenStepToIndex.get(LoadingModalStep.GET_PERMISSION)
      : evmERC20TokenStepToIndex.get(LoadingModalStep.GET_PERMISSION);

  return (
    <>
      <LoadingModalContentHeader>Loading..</LoadingModalContentHeader>
      <ContentProgress totalSteps={totalSteps} activeStep={activeIndex} />
      <LoadingModalContentText>
        {activeIndex}. Confirm to give permission
      </LoadingModalContentText>
    </>
  );
};
