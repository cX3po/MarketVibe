// Base HTTP client with error handling

import axios, { AxiosInstance, AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function createAPIClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
      if (error.response) {
        // Server responded with error status
        throw new APIError(
          error.response.data?.error || error.message,
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Request made but no response
        throw new APIError('No response from server');
      } else {
        // Error in request setup
        throw new APIError(error.message);
      }
    }
  );

  return client;
}
