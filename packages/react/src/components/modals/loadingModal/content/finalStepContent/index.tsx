import React from 'react';

import { LoadingModalContentProps } from '../../shared';
import { ContentProgress } from '../contentProgress';
import { LoadingModalContentHeader, LoadingModalContentText } from '../styles';

export const FinalStepContent = ({ totalSteps }: LoadingModalContentProps) => (
  <>
    <LoadingModalContentHeader>Finalising..</LoadingModalContentHeader>
    <ContentProgress activeStep={totalSteps} totalSteps={totalSteps} />
    <LoadingModalContentText>
      {totalSteps}. Nearly there..
    </LoadingModalContentText>
  </>
);
