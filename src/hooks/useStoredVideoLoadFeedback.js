import { useCallback, useEffect, useState } from 'react';

export function useStoredVideoLoadFeedback({
  loading = false,
  onLoad,
  selectionKey = '',
} = {}) {
  const [loadResult, setLoadResult] = useState(null);
  const [localPending, setLocalPending] = useState(false);

  useEffect(() => {
    setLoadResult(null);
  }, [selectionKey]);

  const loadStoredVideos = useCallback(async () => {
    if (loading || localPending || typeof onLoad !== 'function') return null;

    setLocalPending(true);
    setLoadResult(null);
    try {
      const result = await onLoad();
      const nextResult = result || { success: false, videoCount: 0 };
      setLoadResult(nextResult);
      return nextResult;
    } catch {
      const failedResult = { success: false, videoCount: 0 };
      setLoadResult(failedResult);
      return failedResult;
    } finally {
      setLocalPending(false);
    }
  }, [loading, localPending, onLoad]);

  return {
    loadResult,
    loading: Boolean(loading || localPending),
    onLoadStoredVideos: loadStoredVideos,
  };
}
