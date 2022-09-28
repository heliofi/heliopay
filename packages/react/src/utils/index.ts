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

export const shortenWalletAddress = (address: string): string => {
  if (address === 'null') {
    return 'N/A';
  }
  return `${address.slice(0, 6)}..${address.slice(-3)}`;
};

export const getStringBetween = (
  str: string,
  start: string,
  end: string
): string | undefined => {
  const result = str.match(new RegExp(`${start}(.*)${end}`));
  if (result == null || result.length < 1) {
    return undefined;
  }
  return result[1].trim();
};

export const removeUndefinedFields = (obj: Record<string, unknown>) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
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

export const rgba = (hex: string, alpha: string | number) => {
  const color = hexToRgb(hex);
  return `rgba(${color?.r}, ${color?.g}, ${color?.b}, ${alpha})`;
};
