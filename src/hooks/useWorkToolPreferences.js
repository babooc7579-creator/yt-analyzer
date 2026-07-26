import { useCallback, useEffect, useRef, useState } from 'react';

import { EMPTY_WORK_TOOL_PREFERENCES, normalizeWorkToolPreferences } from '../constants/workTools';
import {
  fetchWorkToolPreferences,
  saveWorkToolPreferences as saveWorkToolPreferencesApi,
} from '../services/workToolPreferencesApi';

export function useWorkToolPreferences({ enabled = false } = {}) {
  const [preferences, setPreferences] = useState(EMPTY_WORK_TOOL_PREFERENCES);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const attemptedLoadRef = useRef(false);

  const loadPreferences = useCallback(async () => {
    if (loading) return { success: false };
    attemptedLoadRef.current = true;
    setLoading(true);
    setError('');

    try {
      const result = await fetchWorkToolPreferences();
      if (result?.success !== true) {
        throw new Error(result?.error || '업무 도구 설정을 불러오지 못했습니다.');
      }
      const nextPreferences = normalizeWorkToolPreferences(result.preferences);
      setPreferences(nextPreferences);
      setLoaded(true);
      return { success: true, preferences: nextPreferences };
    } catch (loadError) {
      setError(loadError.message || '업무 도구 설정을 불러오지 못했습니다.');
      return { success: false, error: loadError };
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (enabled && !loaded && !loading && !attemptedLoadRef.current) loadPreferences();
  }, [enabled, loadPreferences, loaded, loading]);

  const savePreferences = useCallback(async (nextPreferences) => {
    if (saving) return { success: false };
    setSaving(true);
    setError('');

    try {
      const result = await saveWorkToolPreferencesApi(nextPreferences);
      if (result?.success !== true) {
        throw new Error(result?.error || '업무 도구 설정을 저장하지 못했습니다.');
      }
      const savedPreferences = normalizeWorkToolPreferences(result.preferences);
      setPreferences(savedPreferences);
      setLoaded(true);
      return { success: true, preferences: savedPreferences };
    } catch (saveError) {
      setError(saveError.message || '업무 도구 설정을 저장하지 못했습니다.');
      return { success: false, error: saveError };
    } finally {
      setSaving(false);
    }
  }, [saving]);

  return {
    workToolPreferences: preferences,
    workToolPreferencesError: error,
    workToolPreferencesLoaded: loaded,
    workToolPreferencesLoading: loading,
    workToolPreferencesSaving: saving,
    loadWorkToolPreferences: loadPreferences,
    saveWorkToolPreferences: savePreferences,
  };
}
