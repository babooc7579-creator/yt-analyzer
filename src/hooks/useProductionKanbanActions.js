import { useEffect, useState } from 'react';
import {
  getNextDraftRecords,
  getProductionDraftUpdates,
  hasProductionDraftChanges,
} from '../utils/productionKanbanActions';

export function useProductionKanbanActions({
  onMoveVideo,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
  videoUserRecords,
}) {
  const [draftRecords, setDraftRecords] = useState({});
  const [saveStates, setSaveStates] = useState({});
  const [moveStates, setMoveStates] = useState({});
  const [linkMoveStates, setLinkMoveStates] = useState({});

  const clearSavedStateAfterDelay = (setStates, itemId, delay) => {
    setTimeout(() => {
      setStates(prev => {
        if (prev[itemId] !== 'saved') return prev;
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }, delay);
  };

  useEffect(() => {
    setDraftRecords(videoUserRecords);
  }, [videoUserRecords]);

  const updateDraftRecord = (videoId, updates) => {
    setDraftRecords(prev => getNextDraftRecords(prev, videoUserRecords, videoId, updates));
  };

  const hasUnsavedChanges = (videoId) => {
    const saved = videoUserRecords[videoId] || {};
    const draft = draftRecords[videoId] || {};

    return hasProductionDraftChanges(saved, draft);
  };

  const saveDraftRecord = async (videoId) => {
    const draft = draftRecords[videoId] || {};
    setSaveStates(prev => ({ ...prev, [videoId]: 'saving' }));

    const didSave = await onUpdateVideoRecord(videoId, getProductionDraftUpdates(draft));

    setSaveStates(prev => ({ ...prev, [videoId]: didSave ? 'saved' : 'error' }));

    if (didSave) {
      clearSavedStateAfterDelay(setSaveStates, videoId, 2200);
    }
  };

  const moveVideo = async (videoId, status, extraUpdates = {}) => {
    setMoveStates(prev => ({ ...prev, [videoId]: 'saving' }));
    const didMove = await onMoveVideo(videoId, status, extraUpdates);
    setMoveStates(prev => ({ ...prev, [videoId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      clearSavedStateAfterDelay(setMoveStates, videoId, 1600);
    }
  };

  const moveDiscoveryLink = async (linkId, status) => {
    if (!onUpdateDiscoveryLink) return;

    setLinkMoveStates(prev => ({ ...prev, [linkId]: 'saving' }));
    const didMove = await onUpdateDiscoveryLink(linkId, { status });
    setLinkMoveStates(prev => ({ ...prev, [linkId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      clearSavedStateAfterDelay(setLinkMoveStates, linkId, 1600);
    }
  };

  return {
    draftRecords,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
  };
}
