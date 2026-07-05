import { getProductionVideoCardProps } from '../utils/productionKanbanColumn';
import ProductionVideoCard from './ProductionVideoCard';

export default function ProductionKanbanColumn({
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
  videos,
}) {
  return (
    <section className={`rounded-2xl border p-4 ${column.tone}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900">{column.title}</h4>
          <p className="mt-1 text-xs text-slate-500">{column.description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700 shadow-sm">{videos.length}</span>
      </div>

      <div className="space-y-3">
        {videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-xs font-semibold text-slate-400">비어 있음</div>
        ) : (
          videos.map((video) => {
            const cardProps = getProductionVideoCardProps({
              columnId: column.id,
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
            });

            return (
              <ProductionVideoCard key={video.videoId} {...cardProps} />
            );
          })
        )}
      </div>
    </section>
  );
}
