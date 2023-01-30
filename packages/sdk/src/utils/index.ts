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

export const isEmptyObject = (obj?: {}) =>
  obj == null || (typeof obj === "object" && Object.keys(obj).length === 0);

export const fromBigintToStringForSerialization = (value: bigint): string =>
  String(value);
