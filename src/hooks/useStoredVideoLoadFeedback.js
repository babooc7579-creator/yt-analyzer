import { useCallback, useEffect, useRef, useState } from 'react';

export function useStoredVideoLoadFeedback({
  loading = false,
  onLoad,
  selectionKey = '',
} = {}) {
  const [loadResult, setLoadResult] = useState(null);
  const [localPending, setLocalPending] = useState(false);
  const pendingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    requestIdRef.current += 1;
    pendingRef.current = false;
    setLocalPending(false);
    setLoadResult(null);
  }, [selectionKey]);

  const loadStoredVideos = useCallback(async () => {
    if (loading || pendingRef.current || typeof onLoad !== 'function') return null;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    pendingRef.current = true;
    setLocalPending(true);
    setLoadResult(null);
    try {
      const result = await onLoad();
      const nextResult = result || { success: false, videoCount: 0 };
      if (requestIdRef.current === requestId) {
        setLoadResult(nextResult);
      }
      return nextResult;
    } catch {
      const failedResult = { success: false, videoCount: 0 };
      if (requestIdRef.current === requestId) {
        setLoadResult(failedResult);
      }
      return failedResult;
    } finally {
      if (requestIdRef.current === requestId) {
        pendingRef.current = false;
        setLocalPending(false);
      }
    }
  }, [loading, onLoad]);

  return {
    loadResult,
    loading: Boolean(loading || localPending),
    onLoadStoredVideos: loadStoredVideos,
  };
}
