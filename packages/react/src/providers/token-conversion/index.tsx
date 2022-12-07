import { FC, ReactNode, useMemo, useState } from 'react';
import { TokenConversionContext } from './TokenConversionContext';

export const TokenConversionProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [dynamicRateToken, setDynamicRateToken] = useState<string | null>(null);
  const [dynamicRate, setDynamicRate] = useState<number | null>(null);
  const [dynamicRateLoading, setDynamicRateLoading] = useState<boolean>(false);
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);

  const tokenConversionValue = useMemo(
    () => ({
      dynamicRateToken,
      setDynamicRateToken,
      dynamicRate,
      setDynamicRate,
      dynamicRateLoading,
      setDynamicRateLoading,
      tokenExpiration,
      setTokenExpiration,
    }),
    [
      dynamicRateToken,
      setDynamicRateToken,
      dynamicRate,
      setDynamicRate,
      dynamicRateLoading,
      setDynamicRateLoading,
      tokenExpiration,
      setTokenExpiration,
    ]
  );

  return (
    <TokenConversionContext.Provider value={tokenConversionValue}>
      {children}
    </TokenConversionContext.Provider>
  );
};
