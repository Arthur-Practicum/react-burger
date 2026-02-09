import { useState, useEffect, useCallback } from 'react';

type UseFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: BodyInit;
  immediate?: boolean;
};

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (url?: string, options?: UseFetchOptions) => Promise<void>;
};

export const useFetch = <T = unknown>(
  url: string,
  initialOptions?: UseFetchOptions
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: initialOptions?.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...initialOptions?.headers,
        },
        body: initialOptions?.body ? JSON.stringify(initialOptions.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = (await response.json()) as T;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url, initialOptions]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
