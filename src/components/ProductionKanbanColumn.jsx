import {
  getProductionKanbanColumnEmptyTitle,
  getProductionVideoCardProps,
} from '../utils/productionKanbanColumn';
import ProductionVideoCard from './ProductionVideoCard';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ProductionKanbanColumn({
  column,
  draftRecords,
  getScheduleSignal,
  hasUnsavedChanges,
  moveStates,
  onFocus,
  onMove,
  onSave,
  onUpdateDraft,
  saveStates,
  videoUserRecords,
  videos,
}) {
  const videoList = toArray(videos);

  return (
    <section className={`rounded-2xl border p-4 ${column.tone}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900">{column.title}</h4>
          <p className="mt-1 text-xs text-slate-500">{column.description}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700 shadow-sm">{videoList.length}</span>
      </div>

      <div className="space-y-3">
        {videoList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center">
            <p className="text-xs font-extrabold text-slate-500">{getProductionKanbanColumnEmptyTitle(column)}</p>
            {column.emptyDescription ? (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{column.emptyDescription}</p>
            ) : null}
          </div>
        ) : (
          videoList.map((video) => {
            const cardProps = getProductionVideoCardProps({
              columnId: column.id,
              draftRecords,
              getScheduleSignal,
              hasUnsavedChanges,
              moveStates,
              onFocus,
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
