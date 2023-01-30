import { createContext, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { LivePricePayload } from '../../domain';

type Props = {
  dynamicRateToken: string | undefined;
  setDynamicRateToken: (token: string | undefined) => void;
  dynamicRate: number | undefined;
  setDynamicRate: (rate: number | undefined) => void;
  dynamicRateLoading: boolean;
  setDynamicRateLoading: (loading: boolean) => void;
  tokenExpiration: number | undefined;
  setTokenExpiration: (expiration: number | undefined) => void;
};

export const TokenConversionContext = createContext<Props>({
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

  const { apiService } = useCompositionRoot();

  const getTokenPrice = async ({ amount, to, from }: LivePricePayload) => {
    setDynamicRateLoading(true);
    const result = await apiService.getLivePrice(amount, to, from);
    const decodedToken: {
      exp: number;
      rate: number;
    } = jwtDecode(result.rateToken);

    setDynamicRate(decodedToken?.rate);
    setDynamicRateToken(result?.rateToken);
    setTokenExpiration(decodedToken?.exp);
    setDynamicRateLoading(false);
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
