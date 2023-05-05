export const deepMerge = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  Object.keys(source).forEach((key) => {
    if (source[key] instanceof Object) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  });

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

export const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hexTemp = hex.replace(
    shorthandRegex,
    (m: string, r: string, g: string, b: string) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexTemp);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgba = (hex: string, alpha: string | number): string => {
  const color = hexToRgb(hex);
  return `rgba(${color?.r}, ${color?.g}, ${color?.b}, ${alpha})`;
};

export const roundValue = (amount: number | string, decimals: number): string =>
  parseFloat(String(amount)).toFixed(decimals);

export const removeUndefinedFields = <T>(
  obj: Record<string, unknown>,
  includeEmptyStrings?: boolean
): T => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (
      newObj[key] === undefined ||
      (includeEmptyStrings && newObj[key] === '')
    ) {
      delete newObj[key];
    }
  });
  return newObj as unknown as T;
};

export const shortenString = (str: string, len: number): string =>
  str.length > len ? `${str.slice(0, len)}...` : str;
