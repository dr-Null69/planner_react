const BASE_URL = import.meta.env.VITE_API_URL;

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL is not defined in environment variables');
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: 'GET', signal });
  },

  post<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      signal,
    });
  },

  patch<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      signal,
    });
  },

  delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', signal });
  },
};