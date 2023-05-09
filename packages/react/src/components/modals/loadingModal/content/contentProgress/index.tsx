import React from 'react';

import { LoadingModalContentProps } from '../../shared';
import { ContentProgressContainer, ContentProgressItem } from './styles';

export type LoadingModalContentProgressProps = LoadingModalContentProps;

export const ContentProgress = ({
  activeStep = 1,
  totalSteps,
}: LoadingModalContentProgressProps) => {
  const items = new Array(totalSteps).fill(0).map((_, index) => index + 1);

  return (
    <ContentProgressContainer>
      {items.map((item) => (
        <ContentProgressItem active={item <= activeStep} key={item} />
      ))}
    </ContentProgressContainer>
  );
};
