import { useUploadCalendarState } from '../hooks/useUploadCalendarState';
import {
  getUploadCalendarEmptyState,
  getUploadCalendarFilterEmptyState,
} from '../utils/uploadCalendar';
import UploadCalendarDayDetails from './UploadCalendarDayDetails';
import UploadCalendarGrid from './UploadCalendarGrid';
import UploadCalendarHeader from './UploadCalendarHeader';
import UploadCalendarSummary from './UploadCalendarSummary';

export default function UploadCalendarWorkspace({
  onOpenProductionCandidate,
  onOpenProductionCandidates,
  videoUserRecords,
  videos,
}) {
  const state = useUploadCalendarState({ videoUserRecords, videos });
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
        {emptyState ? (
          <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
            <h3 className="text-base font-extrabold text-white">{emptyState.title}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{emptyState.description}</p>
            <button type="button" onClick={onOpenProductionCandidates} className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950">제작 후보함 열기</button>
          </div>
        ) : filterEmptyState ? (
          <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
            <h3 className="text-base font-extrabold text-white">{filterEmptyState.title}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{filterEmptyState.description}</p>
            <button type="button" onClick={() => state.setStatusFilter('all')} className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950">{filterEmptyState.actionLabel}</button>
          </div>
        ) : (
          <>
            <UploadCalendarGrid days={state.gridDays} onSelectDate={state.setSelectedDate} selectedDate={state.selectedDate} />
            <UploadCalendarDayDetails
              items={state.selectedDayItems}
              onOpenProductionCandidate={onOpenProductionCandidate}
              onOpenProductionCandidates={onOpenProductionCandidates}
              selectedDate={state.selectedDate}
            />
          </>
        )}
      </div>
    </section>
  );
}
