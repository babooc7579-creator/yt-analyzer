export const getProductionKanbanColumnEmptyTitle = (column = {}) => (
  column.emptyTitle || '비어 있음'
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
  const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};

  return {
    columnId,
    isDirty: hasUnsavedChanges(video.videoId),
    moveState: moveStates[video.videoId],
    onMove,
    onSave,
    onUpdateDraft,
    record,
    saveState: saveStates[video.videoId],
    scheduleSignal: getScheduleSignal(record),
    video,
  };
};
