const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const toRecordObject = (record) => (
  record && typeof record === 'object' ? record : {}
);

export const getNextDraftRecords = (draftRecords, videoUserRecords, videoId, updates) => {
  const drafts = toRecordMap(draftRecords);
  if (!videoId) return drafts;

  const records = toRecordMap(videoUserRecords);

  return {
    ...drafts,
    [videoId]: {
      ...(drafts[videoId] || records[videoId] || {}),
      videoId,
      ...toRecordObject(updates),
    },
  };
};

export const hasProductionDraftChanges = (saved = {}, draft = {}) => {
  const savedRecord = toRecordObject(saved);
  const draftRecord = toRecordObject(draft);

  return (
    (savedRecord.draftTitle || '') !== (draftRecord.draftTitle || '')
    || (savedRecord.note || '') !== (draftRecord.note || '')
    || (savedRecord.scriptAnalysis || '') !== (draftRecord.scriptAnalysis || '')
    || (savedRecord.scriptBody || '') !== (draftRecord.scriptBody || '')
    || (savedRecord.scriptOutline || '') !== (draftRecord.scriptOutline || '')
    || (savedRecord.scriptStatus || '') !== (draftRecord.scriptStatus || '')
    || (savedRecord.targetPublishDate || '') !== (draftRecord.targetPublishDate || '')
  );
};

export const getProductionDraftUpdates = (draft = {}) => {
  const draftRecord = toRecordObject(draft);

  return {
    draftTitle: draftRecord.draftTitle || '',
    note: draftRecord.note || '',
    scriptAnalysis: draftRecord.scriptAnalysis || '',
    scriptBody: draftRecord.scriptBody || '',
    scriptOutline: draftRecord.scriptOutline || '',
    scriptStatus: draftRecord.scriptStatus || '',
    targetPublishDate: draftRecord.targetPublishDate || '',
  };
};

export const getProductionDiscoveryLinkMoveUpdates = (status) => ({
  status,
});

export const getClearedSavedState = (states, itemId) => {
  const stateMap = toRecordMap(states);

  if (stateMap[itemId] !== 'saved') return stateMap;

  const nextState = { ...stateMap };
  delete nextState[itemId];
  return nextState;
};
