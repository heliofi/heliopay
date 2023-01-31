import { createContext, useContext } from 'react';
import { HelioSDK } from '@heliofi/sdk';

interface CompositionRoot {
  HelioSDK: HelioSDK;
}

export const compositionRoot = {
  HelioSDK: new HelioSDK(),
};

export const CompositionRootContext =
  createContext<CompositionRoot>(compositionRoot);

export const useCompositionRoot = (): CompositionRoot =>
  useContext(CompositionRootContext);
