import { createContext, useContext } from 'react';
import {HelioApiAdapterV1} from "../infrastructure/helio-api/HelioApiAdapterV1";

interface CompositionRoot {
  apiService: HelioApiAdapterV1;
}

export const compositionRoot = {
  apiService: new HelioApiAdapterV1(),
};

export const CompositionRootContext =
  createContext<CompositionRoot>(compositionRoot);

export const useCompositionRoot = (): CompositionRoot =>
  useContext(CompositionRootContext);
