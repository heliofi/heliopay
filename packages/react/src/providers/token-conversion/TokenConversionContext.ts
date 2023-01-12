import { createContext, useContext } from 'react';
import { LivePricePayload } from '../../domain/model/TokenConversion';
import { useHelioProvider } from '../helio/HelioContext';
import {JWTService} from "../../domain/services/JWTService";
import {useCompositionRoot} from "../../hooks/compositionRoot";

export const TokenConversionContext = createContext<{
  dynamicRateToken: string | undefined;
  setDynamicRateToken: (token: string | undefined) => void;
  dynamicRate: number | undefined;
  setDynamicRate: (rate: number | undefined) => void;
  dynamicRateLoading: boolean;
  setDynamicRateLoading: (loading: boolean) => void;
  tokenExpiration: number | undefined;
  setTokenExpiration: (expiration: number | undefined) => void;
}>({
  dynamicRateToken: undefined,
  setDynamicRateToken: () => {},
  dynamicRate: undefined,
  setDynamicRate: () => {},
  dynamicRateLoading: false,
  setDynamicRateLoading: () => {},
  tokenExpiration: undefined,
  setTokenExpiration: () => {},
});

export const useTokenConversion = () => {
  const {
    dynamicRateToken,
    setDynamicRateToken,
    dynamicRate,
    setDynamicRate,
    dynamicRateLoading,
    setDynamicRateLoading,
    tokenExpiration,
    setTokenExpiration,
  } = useContext(TokenConversionContext);

  const { cluster } = useHelioProvider();
  const { apiService } = useCompositionRoot();

  const getTokenPrice = async ({ amount, to, from }: LivePricePayload) => {
    setDynamicRateLoading(true);
    if (cluster) {
      const result = await apiService.getLivePrice(amount, to, from, cluster);

      const decodedToken = JWTService.decodeToken(result.rateToken);

      setDynamicRate(decodedToken?.rate);
      setDynamicRateToken(result?.rateToken);
      setTokenExpiration(decodedToken?.exp);
      setDynamicRateLoading(false);
    }
  };

  return {
    dynamicRateToken,
    setDynamicRateToken,
    dynamicRate,
    setDynamicRate,
    dynamicRateLoading,
    setDynamicRateLoading,
    getTokenPrice,
    tokenExpiration,
    setTokenExpiration,
  };
};
