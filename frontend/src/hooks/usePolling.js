import { useEffect, useRef } from 'react';

export function usePolling(callback, interval = 5000, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || interval == null) return;

    // Trigger initial poll immediately
    savedCallback.current();

    const id = setInterval(() => {
      savedCallback.current();
    }, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
}

export default usePolling;
