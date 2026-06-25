import { useEffect, useRef, useState } from "react";

import { readCache, writeCache } from "../services/cache";

const RETRY_INTERVAL = 5000;

type OfflineResource<T> = {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: boolean;
  reload: () => void;
};

export function useOfflineResource<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
): OfflineResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const retryTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(true);

  const load = async () => {
    clearTimeout(retryTimer.current);

    const cached = await readCache<T>(cacheKey);
    if (!mounted.current) return;
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    setRefreshing(true);
    setError(false);
    try {
      const fresh = await fetcherRef.current();
      if (!mounted.current) return;
      setData(fresh);
      writeCache(cacheKey, fresh);
    } catch {
      if (!mounted.current) return;
      if (!cached) setError(true);
      retryTimer.current = setTimeout(load, RETRY_INTERVAL);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
      clearTimeout(retryTimer.current);
    };
  }, [cacheKey]);

  return { data, loading, refreshing, error, reload: load };
}
