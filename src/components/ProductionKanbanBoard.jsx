import ProductionKanbanColumn from './ProductionKanbanColumn';

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
    videos: groupedVideos[column.id],
  });

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <ProductionKanbanColumn key={column.id} {...getColumnProps(column)} />
      ))}
    </div>
  );
}
