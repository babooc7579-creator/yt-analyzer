import { CalendarDays, Pin } from 'lucide-react';

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
  onOpenUploadCalendar,
  onSave,
  onUpdateDraft,
  saveStates,
  videoUserRecords,
  videos,
}) {
  const videoList = toArray(videos);

  return (
    <section className="border-y border-amber-200 bg-amber-50/70 px-1 py-4">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 px-3 sm:flex-row">
        <div className="flex min-w-0 items-start gap-3">
          <Pin className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-900">{PRODUCTION_FOCUS_COLUMN.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {PRODUCTION_FOCUS_COLUMN.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <span
            aria-label={`오늘 집중 영상 ${videoList.length}개`}
            className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-amber-800 shadow-sm"
          >
            {videoList.length}
          </span>
          {videoList.length > 0 && typeof onOpenUploadCalendar === 'function' ? (
            <button
              type="button"
              onClick={onOpenUploadCalendar}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-extrabold text-amber-800 transition hover:bg-amber-100"
              title="업로드 캘린더를 열어 오늘 집중 후보의 목표 날짜를 확인합니다. YouTube API를 호출하지 않습니다."
              aria-label="오늘 집중 후보 업로드 일정 정하기, 화면 이동과 Cloud 저장 일정 조회이며 YouTube API 호출 없음"
            >
              <CalendarDays className="h-4 w-4" /> 일정 정하기
            </button>
          ) : null}
        </div>
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
