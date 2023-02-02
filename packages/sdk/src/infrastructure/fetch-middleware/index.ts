import { ResponseError } from './ResponseError';

type ErrorMessage = {
  message: string;
};

export type FetchOptions = RequestInit & {
  clearContentType?: boolean;
};

class NoContent {}

const parseJSON = async <T>(response: Response): Promise<T> => {
  if (response.status === 204 || response.status === 205) {
    return new NoContent() as T;
  }
  return response.json();
};

const validateStatus = async (response: Response): Promise<void> => {
  if (response.status >= 200 && response.status < 300) {
    return;
  }
  const errorResult: ErrorMessage = await response.json();
  throw new ResponseError(
    response,
    errorResult?.message || response.statusText
  );
};

export const request = async <T>(
  url: string,
  options?: RequestInit,
  shouldParseJSON = true
): Promise<T> => {
  if (shouldParseJSON) {
    const response = await fetch(url, options);
    await validateStatus(response);
    return parseJSON(response);
  }
  return fetch(url, options) as unknown as Promise<T>;
};

const bearerAuth = (token?: string): HeadersInit =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const enhanceOptions = (
  options: FetchOptions,
  token?: string
): RequestInit => {
  const contentType = !options.clearContentType
    ? { 'Content-Type': 'application/json' }
    : null;

  return {
    ...options,
    headers: {
      ...contentType,
      ...bearerAuth(token),
      ...options.headers,
    },
  };
};

export * from './ResponseError';
