export class NumberService {
  static formatNumber(value: number | string): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static formatDecimal(value: number, decimalsCount = 4): number {
    return Number(value.toFixed(decimalsCount));
  }

  static padStart(value: number, length: number, padString = '0'): string {
    return value.toString().padStart(length, padString);
  }
}
