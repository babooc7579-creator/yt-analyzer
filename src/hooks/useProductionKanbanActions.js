import { useEffect, useRef, useState } from 'react';
import {
  getClearedSavedState,
  getProductionDiscoveryLinkMoveUpdates,
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
  const pendingOperationsRef = useRef(new Set());

  const beginOperation = (operationKey) => {
    if (!operationKey || pendingOperationsRef.current.has(operationKey)) return false;
    pendingOperationsRef.current.add(operationKey);
    return true;
  };

  const finishOperation = (operationKey) => {
    pendingOperationsRef.current.delete(operationKey);
  };

  const clearSavedStateAfterDelay = (setStates, itemId, delay) => {
    setTimeout(() => {
      setStates(prev => getClearedSavedState(prev, itemId));
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
    const operationKey = videoId ? `draft:${videoId}` : '';
    if (!beginOperation(operationKey)) return false;

    const draft = draftRecords[videoId] || {};
    setSaveStates(prev => ({ ...prev, [videoId]: 'saving' }));

    let didSave = false;
    try {
      didSave = Boolean(await onUpdateVideoRecord(videoId, getProductionDraftUpdates(draft)));
    } catch {
      didSave = false;
    } finally {
      finishOperation(operationKey);
    }

    setSaveStates(prev => ({ ...prev, [videoId]: didSave ? 'saved' : 'error' }));

    if (didSave) {
      clearSavedStateAfterDelay(setSaveStates, videoId, 2200);
    }

    return didSave;
  };

  const moveVideo = async (videoId, status, extraUpdates = {}) => {
    const operationKey = videoId ? `video:${videoId}` : '';
    if (!beginOperation(operationKey)) return false;

    setMoveStates(prev => ({ ...prev, [videoId]: 'saving' }));
    let didMove = false;
    try {
      didMove = Boolean(await onMoveVideo(videoId, status, extraUpdates));
    } catch {
      didMove = false;
    } finally {
      finishOperation(operationKey);
    }
    setMoveStates(prev => ({ ...prev, [videoId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      clearSavedStateAfterDelay(setMoveStates, videoId, 1600);
    }

    return didMove;
  };

  const updateVideoFocus = async (videoId, focusPinnedAt) => {
    const operationKey = videoId ? `video:${videoId}` : '';
    if (!beginOperation(operationKey)) return false;

    setMoveStates(prev => ({ ...prev, [videoId]: 'saving' }));
    let didUpdate = false;
    try {
      didUpdate = Boolean(await onUpdateVideoRecord(videoId, { focusPinnedAt }));
    } catch {
      didUpdate = false;
    } finally {
      finishOperation(operationKey);
    }
    setMoveStates(prev => ({ ...prev, [videoId]: didUpdate ? 'saved' : 'error' }));

    if (didUpdate) {
      clearSavedStateAfterDelay(setMoveStates, videoId, 1600);
    }

    return didUpdate;
  };

  const moveDiscoveryLink = async (linkId, status) => {
    const operationKey = linkId ? `link:${linkId}` : '';
    if (!onUpdateDiscoveryLink || !beginOperation(operationKey)) return false;

    setLinkMoveStates(prev => ({ ...prev, [linkId]: 'saving' }));
    let didMove = false;
    try {
      didMove = Boolean(await onUpdateDiscoveryLink(linkId, getProductionDiscoveryLinkMoveUpdates(status)));
    } catch {
      didMove = false;
    } finally {
      finishOperation(operationKey);
    }
    setLinkMoveStates(prev => ({ ...prev, [linkId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      clearSavedStateAfterDelay(setLinkMoveStates, linkId, 1600);
    }

    return didMove;
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
    updateVideoFocus,
  };
}
