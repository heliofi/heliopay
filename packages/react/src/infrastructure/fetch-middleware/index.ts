import {getHelioApiBaseUrl} from '../config';
import {Cluster} from "@solana/web3.js";

type ErrorMessage = {
  message: string;
};

type FetchOptions = RequestInit & {
  clearContentType?: boolean;
};

class NoContent {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseType = Record<string, any>;

export class ResponseError extends Error {
  public response: Response;
  public message: string;

  constructor(response: Response, message: string) {
    super(response.statusText);
    this.response = response;
    this.message = message;
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

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

export const publicRequest = async <T>(
  endpoint: string,
  cluster: Cluster,
  options: FetchOptions = {},
  shouldParseJSON = false
): Promise<T> => {
  return request<T>(
    getHelioApiBaseUrl(cluster) + endpoint,
    enhanceOptions(options),
    shouldParseJSON
  );
};

const enhanceOptions = (options: FetchOptions, token?: string): RequestInit => {
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

const bearerAuth = (token?: string): HeadersInit => {
  return token ? { Authorization: 'Bearer ' + token } : {};
};
