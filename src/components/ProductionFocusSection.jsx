import { Pin } from 'lucide-react';

import { PRODUCTION_FOCUS_COLUMN } from '../constants/productionKanban';
import { getProductionVideoCardProps } from '../utils/productionKanbanColumn';
import ProductionVideoCard from './ProductionVideoCard';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ProductionFocusSection({
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
    <section className="border-y border-amber-200 bg-amber-50/70 px-1 py-4">
      <div className="mb-4 flex items-start justify-between gap-3 px-3">
        <div className="flex min-w-0 items-start gap-3">
          <Pin className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-900">{PRODUCTION_FOCUS_COLUMN.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {PRODUCTION_FOCUS_COLUMN.description}
            </p>
          </div>
        </div>
        <span
          aria-label={`오늘 집중 영상 ${videoList.length}개`}
          className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-amber-800 shadow-sm"
        >
          {videoList.length}
        </span>
      </div>

      {videoList.length === 0 ? (
        <div className="mx-3 border border-dashed border-amber-300 bg-white/70 p-4 text-center">
          <p className="text-xs font-extrabold text-slate-600">{PRODUCTION_FOCUS_COLUMN.emptyTitle}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            {PRODUCTION_FOCUS_COLUMN.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 px-3 xl:grid-cols-2">
          {videoList.map((video) => (
            <ProductionVideoCard
              key={video.videoId}
              {...getProductionVideoCardProps({
                columnId: PRODUCTION_FOCUS_COLUMN.id,
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
              })}
            />
          ))}
        </div>
      )}
    </section>
  );
}
