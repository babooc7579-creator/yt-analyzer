export const getNextDraftRecords = (draftRecords, videoUserRecords, videoId, updates) => ({
  ...draftRecords,
  [videoId]: {
    ...(draftRecords[videoId] || videoUserRecords[videoId] || {}),
    videoId,
    ...updates,
  },
});

export const hasProductionDraftChanges = (saved = {}, draft = {}) => (
  (saved.draftTitle || '') !== (draft.draftTitle || '')
  || (saved.note || '') !== (draft.note || '')
  || (saved.targetPublishDate || '') !== (draft.targetPublishDate || '')
);

export const getProductionDraftUpdates = (draft = {}) => ({
  draftTitle: draft.draftTitle || '',
  note: draft.note || '',
  targetPublishDate: draft.targetPublishDate || '',
});
