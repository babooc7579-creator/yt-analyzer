const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

export const getProductionKanbanColumns = (columns) => toArray(columns);

export const getProductionKanbanColumnProps = ({
  column,
  draftRecords,
  getScheduleSignal,
  groupedVideos,
  hasUnsavedChanges,
  moveStates,
  onMove,
  onSave,
  onUpdateDraft,
  saveStates,
  videoUserRecords,
}) => {
  const groupedVideoMap = toRecordMap(groupedVideos);

  return {
    column,
    draftRecords,
    getScheduleSignal,
    hasUnsavedChanges,
    moveStates,
    onMove,
    onSave,
    onUpdateDraft,
    saveStates,
    videoUserRecords,
    videos: groupedVideoMap[column.id],
  };
};
