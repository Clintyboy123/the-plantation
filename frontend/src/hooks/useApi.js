import { useCallback, useEffect, useState } from 'react';

// Loads data from the API and gives a page everything it needs for its three states:
//   const { data, loading, error, reload } = useApi(() => api.get('/bookings'));
export default function useApi(request, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(request, deps);

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    run()
      .then((response) => active && setState({ data: response.data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => {
      active = false;
    };
  }, [run]);

  useEffect(() => load(), [load]);

  return { ...state, reload: load };
}
