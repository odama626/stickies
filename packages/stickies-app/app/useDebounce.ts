import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useDebounce(callback, timeout = 250) {
  const callbackRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(() => debounce(callbackRef.current, timeout), [timeout]);
}

export function debounce(callback, timeout = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
}
