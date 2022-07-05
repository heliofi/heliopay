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
