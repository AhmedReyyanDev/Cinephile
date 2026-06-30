import { useCallback, useEffect, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Minimal async data hook with refetch support.
 * `deps` controls when the loader re-runs.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: ReadonlyArray<unknown> = []
) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await loader();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let active = true;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await loader();
        if (active) setState({ data, loading: false, error: null });
      } catch (error) {
        if (active) setState({ data: null, loading: false, error: error as Error });
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
