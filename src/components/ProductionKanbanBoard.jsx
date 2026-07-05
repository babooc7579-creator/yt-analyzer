import ProductionKanbanColumn from './ProductionKanbanColumn';

const toArray = (items) => (Array.isArray(items) ? items : []);
const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

export default function ProductionKanbanBoard({
  columns,
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
}) {
  const columnList = toArray(columns);
  const groupedVideoMap = toRecordMap(groupedVideos);

  const getColumnProps = (column) => ({
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
  });

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {columnList.map((column) => (
        <ProductionKanbanColumn key={column.id} {...getColumnProps(column)} />
      ))}
    </div>
  );
}
