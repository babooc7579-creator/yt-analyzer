import {
  getProductionKanbanColumnProps,
  getProductionKanbanColumns,
} from '../utils/productionKanbanBoard';
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
  const columnList = getProductionKanbanColumns(columns);

  const getColumnProps = (column) => getProductionKanbanColumnProps({
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
  });

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {columnList.map((column) => (
        <ProductionKanbanColumn key={column.id} {...getColumnProps(column)} />
      ))}
    </div>
  );
}
