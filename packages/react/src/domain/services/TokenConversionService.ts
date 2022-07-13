
export class TokenConversionService {
  static convertFromMinimalUnits(
    currency: any,
    minimalAmount: number
  ): number {
    const currencyMeta = currency;
    if (currencyMeta == null) {
      return 0;
    }
    return minimalAmount / Math.pow(10, currencyMeta.decimals);
  }

  static convertToMinimalUnits(currency?: any, actualAmount?: number): number {
    if (currency == null || actualAmount == null) return 0;
    const currencyMeta = currency;
    if (currencyMeta == null) {
      return 0;
    }
    return Math.round(Math.pow(10, currencyMeta.decimals) * actualAmount);
  }
}
