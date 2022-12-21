import { createContext, useContext } from 'react';
import { HelioApiAdapter } from '../infrastructure/helio-api/HelioApiAdapter';

interface CompositionRoot {
  apiService: HelioApiAdapter;
}

export const compositionRoot = {
  apiService: new HelioApiAdapter(),
};

export const CompositionRootContext =
  createContext<CompositionRoot>(compositionRoot);

export const useCompositionRoot = (): CompositionRoot =>
  useContext(CompositionRootContext);
