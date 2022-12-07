import { createContext, useContext } from 'react';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';
import { LivePricePayload } from '../../domain/model/TokenConversion';
import { useHelioProvider } from '../helio/HelioContext';
import { JWTService } from '../../domain/services/JWTService';

export const TokenConversionContext = createContext<{
  dynamicRateToken: string | null;
  setDynamicRateToken: (token: string | null) => void;
  dynamicRate: number | null;
  setDynamicRate: (rate: number | null) => void;
  dynamicRateLoading: boolean;
  setDynamicRateLoading: (loading: boolean) => void;
  tokenExpiration: number | null;
  setTokenExpiration: (expiration: number | null) => void;
}>({
  dynamicRateToken: null,
  setDynamicRateToken: () => {},
  dynamicRate: null,
  setDynamicRate: () => {},
  dynamicRateLoading: false,
  setDynamicRateLoading: () => {},
  tokenExpiration: null,
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

  const getTokenPrice = async ({ amount, to, from }: LivePricePayload) => {
    setDynamicRateLoading(true);
    if (cluster) {
      const result = await HelioApiAdapter.getLivePrice(
        amount,
        to,
        from,
        cluster
      );

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
