export const deepMerge = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], deepMerge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

export const shortenWalletAddress = (address: string): string => {
  if (address == 'null') {
    return 'N/A';
  }
  return `${address.slice(0, 6)}..${address.slice(-3)}`;
};


export const getStringBetween = (
  str: string,
  start: string,
  end: string
): string | undefined => {
  const result = str.match(new RegExp(start + '(.*)' + end));
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
