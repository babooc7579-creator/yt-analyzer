import { useUploadCalendarState } from '../hooks/useUploadCalendarState';
import {
  getUploadCalendarEmptyState,
  getUploadCalendarFilterEmptyState,
} from '../utils/uploadCalendar';
import UploadCalendarDayDetails from './UploadCalendarDayDetails';
import UploadCalendarGrid from './UploadCalendarGrid';
import UploadCalendarHeader from './UploadCalendarHeader';
import UploadCalendarSummary from './UploadCalendarSummary';
import UploadCalendarUnscheduledList from './UploadCalendarUnscheduledList';

export default function UploadCalendarWorkspace({
  initialTargetPublishDate,
  initialTargetVideoId,
  onOpenProductionCandidate,
  onOpenProductionCandidates,
  onOpenScriptBoard,
  videoUserRecords,
  videos,
}) {
  const state = useUploadCalendarState({
    initialTargetPublishDate,
    initialTargetVideoId,
    videoUserRecords,
    videos,
  });
  const emptyState = getUploadCalendarEmptyState({
    productionRecordCount: state.productionRecordCount,
    scheduledCount: state.allItems.length,
  });
  const filterEmptyState = getUploadCalendarFilterEmptyState({
    statusFilter: state.statusFilter,
    visibleCount: state.visibleItems.length,
  });

  return (
    <section data-testid="creator-route-upload-calendar" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <UploadCalendarHeader
        monthLabel={state.monthLabel}
        onNextMonth={state.goNextMonth}
        onOpenProductionCandidates={onOpenProductionCandidates}
        onPreviousMonth={state.goPreviousMonth}
        onStatusFilterChange={state.setStatusFilter}
        onToday={state.goToday}
        statusFilter={state.statusFilter}
      />

      <div className="mt-5 space-y-4">
        <UploadCalendarSummary summary={state.summary} />
        <UploadCalendarUnscheduledList
          focusedVideoId={state.initialTargetVideoId}
          items={state.visibleUnscheduledItems}
          onOpenProductionCandidate={onOpenProductionCandidate}
          onOpenProductionCandidates={onOpenProductionCandidates}
          onOpenScriptBoard={onOpenScriptBoard}
        />
        {emptyState ? (
          <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
            <h3 className="text-base font-extrabold text-white">{emptyState.title}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{emptyState.description}</p>
            <button
              type="button"
              onClick={onOpenProductionCandidates}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950"
              title="제작 후보함으로 이동합니다. 이동만으로 일정 저장이나 YouTube API 호출은 실행되지 않습니다."
              aria-label="제작 후보함으로 이동, 일정 저장 및 YouTube API 호출 없음"
            >
              제작 후보함 열기
            </button>
          </div>
        ) : filterEmptyState ? (
          <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
            <h3 className="text-base font-extrabold text-white">{filterEmptyState.title}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{filterEmptyState.description}</p>
            <button
              type="button"
              onClick={() => state.setStatusFilter('all')}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950"
              title="제작 상태 필터를 전체로 바꿉니다. 화면 표시만 변경하며 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다."
              aria-label="제작 상태 필터 전체 보기, 화면 표시만 변경"
            >
              {filterEmptyState.actionLabel}
            </button>
          </div>
        ) : (
          <>
            <UploadCalendarGrid days={state.gridDays} onSelectDate={state.setSelectedDate} selectedDate={state.selectedDate} />
            <UploadCalendarDayDetails
              focusedVideoId={state.initialTargetVideoId}
              items={state.selectedDayItems}
              onOpenProductionCandidate={onOpenProductionCandidate}
              onOpenProductionCandidates={onOpenProductionCandidates}
              onOpenScriptBoard={onOpenScriptBoard}
              selectedDate={state.selectedDate}
            />
          </>
        )}
      </div>
    </section>
  );
}
