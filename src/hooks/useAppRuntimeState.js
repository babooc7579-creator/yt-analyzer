import { useRef, useState } from 'react';

export function useAppRuntimeState() {
  const [apiKey, setApiKey] = useState('');
  const [updatingChannelId, setUpdatingChannelId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningTag, setScanningTag] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState('');
  const [storedVideoLoadResult, setStoredVideoLoadResult] = useState(null);
  const storedVideoLoadRequestRef = useRef({
    activeRequestId: null,
    requestId: 0,
    selectionKey: '',
  });

  return {
    apiKey,
    error,
    isScanning,
    loading,
    progressMsg,
    scanningTag,
    setApiKey,
    setError,
    setIsScanning,
    setLoading,
    setProgressMsg,
    setScanningTag,
    setStoredVideoLoadResult,
    setUpdatingChannelId,
    setVideos,
    updatingChannelId,
    videos,
    storedVideoLoadResult,
    storedVideoLoadRequestRef,
  };
}
