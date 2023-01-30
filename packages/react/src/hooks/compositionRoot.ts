import { createContext, useContext } from 'react';
import { HelioApiConnector, HelioSDK } from '@heliofi/sdk';

interface CompositionRoot {
  apiService: HelioApiConnector;
}

export const compositionRoot = {
  apiService: HelioSDK.apiService,
};

export const CompositionRootContext =
  createContext<CompositionRoot>(compositionRoot);

export const useCompositionRoot = (): CompositionRoot =>
  useContext(CompositionRootContext);
