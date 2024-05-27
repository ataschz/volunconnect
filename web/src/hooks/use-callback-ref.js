import { useCallback, useEffect, useRef } from "react";

export function useCallbackRef(callback, deps = []) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args) => callbackRef.current?.(...args), deps);
}
