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
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <ProductionKanbanColumn
          key={column.id}
          column={column}
          draftRecords={draftRecords}
          getScheduleSignal={getScheduleSignal}
          hasUnsavedChanges={hasUnsavedChanges}
          moveStates={moveStates}
          onMove={onMove}
          onSave={onSave}
          onUpdateDraft={onUpdateDraft}
          saveStates={saveStates}
          videoUserRecords={videoUserRecords}
          videos={groupedVideos[column.id]}
        />
      ))}
    </div>
  );
}
