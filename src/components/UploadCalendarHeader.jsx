import { ArrowLeft, ArrowRight, CalendarCheck, ListTodo } from 'lucide-react';

import { UPLOAD_CALENDAR_STATUS_OPTIONS } from '../utils/uploadCalendar';

export default function UploadCalendarHeader({
  monthLabel,
  onNextMonth,
  onOpenProductionCandidates,
  onPreviousMonth,
  onToday,
  onStatusFilterChange,
  statusFilter,
}) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300"><CalendarCheck className="h-5 w-5" /></div>
          <div>
            <p className="text-xs font-extrabold text-amber-300">제작 스튜디오</p>
            <h2 className="mt-1 text-xl font-black text-white">업로드 캘린더</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              제작 후보함에 Cloud 저장된 목표 업로드 날짜를 모아 봅니다. 달력 조회만으로 YouTube API를 호출하지 않습니다.
            </p>
          </div>
        </div>
        <button type="button" onClick={onOpenProductionCandidates} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-black text-slate-950 hover:bg-amber-200">
          <ListTodo className="h-4 w-4" /> 제작 후보함에서 일정 수정
        </button>
      </div>

      <div className="flex flex-col gap-2 border-y border-slate-800 bg-slate-950/55 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPreviousMonth} aria-label="이전 달" title="이전 달" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"><ArrowLeft className="h-4 w-4" /></button>
          <h3 className="min-w-28 text-center text-base font-black text-white">{monthLabel}</h3>
          <button type="button" onClick={onNextMonth} aria-label="다음 달" title="다음 달" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"><ArrowRight className="h-4 w-4" /></button>
          <button type="button" onClick={onToday} className="h-9 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-200 hover:bg-slate-800">오늘</button>
        </div>
        <label>
          <span className="sr-only">제작 상태 필터</span>
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-amber-300 sm:w-44">
            {UPLOAD_CALENDAR_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
    </header>
  );
}
