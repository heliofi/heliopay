import { LoadingModalStep } from '@heliofi/sdk';

export const evmNativeTokenStepToIndex = new Map<LoadingModalStep, number>([
  [LoadingModalStep.SIGN_TRANSACTION, 1],
  [LoadingModalStep.SUBMIT_TRANSACTION, 2],
]);

export const evmERC20TokenStepToIndex = new Map<LoadingModalStep, number>([
  [LoadingModalStep.GET_PERMISSION, 1],
  [LoadingModalStep.SIGN_TRANSACTION, 2],
  [LoadingModalStep.SUBMIT_TRANSACTION, 3],
]);
