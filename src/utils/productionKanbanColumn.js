export const getProductionKanbanColumnEmptyTitle = (column = {}) => (
  column.emptyTitle || '비어 있음'
);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const getVideoId = (video) => (
  video && typeof video === 'object' ? video.videoId : undefined
);

const runPredicate = (predicate, value) => (
  typeof predicate === 'function' ? predicate(value) : false
);

const runMapper = (mapper, value) => (
  typeof mapper === 'function' ? mapper(value) : ''
);

export const getProductionVideoCardProps = ({
  columnId,
  draftRecords,
  getScheduleSignal,
  hasUnsavedChanges,
  moveStates,
  onMove,
  onSave,
  onUpdateDraft,
  saveStates,
  video,
  videoUserRecords,
}) => {
  const videoId = getVideoId(video);
  const drafts = toRecordMap(draftRecords);
  const records = toRecordMap(videoUserRecords);
  const moves = toRecordMap(moveStates);
  const saves = toRecordMap(saveStates);
  const record = (videoId && (drafts[videoId] || records[videoId])) || {};

  return {
    columnId,
    isDirty: runPredicate(hasUnsavedChanges, videoId),
    moveState: videoId ? moves[videoId] : undefined,
    onMove,
    onSave,
    onUpdateDraft,
    record,
    saveState: videoId ? saves[videoId] : undefined,
    scheduleSignal: runMapper(getScheduleSignal, record),
    video: video || {},
  };
};
