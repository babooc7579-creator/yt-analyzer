import { CalendarDays } from 'lucide-react';

import { formatDateWithDots } from '../utils/dates';

export default function ProductionKanbanScheduleSummary({ productionSummary }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
      <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700">
        <CalendarDays className="h-3 w-3" /> 다음 일정
      </p>
      <p className="mt-1 truncate text-sm font-black text-amber-950">
        {productionSummary.nextScheduled ? formatDateWithDots(productionSummary.nextScheduled.date) : '일정 없음'}
      </p>
      {productionSummary.nextScheduled && (
        <p className="mt-1 line-clamp-1 text-[10px] font-bold text-amber-800">
          {productionSummary.nextScheduled.video.title}
        </p>
      )}
      {productionSummary.overdueCount > 0 && (
        <p className="mt-1 text-[10px] font-bold text-rose-600">지난 일정 {productionSummary.overdueCount}개 확인 필요</p>
      )}
      {productionSummary.activeWithoutDate > 0 && (
        <p className="mt-1 text-[10px] font-bold text-amber-700">제작 중 {productionSummary.activeWithoutDate}개 일정 미정</p>
      )}
    </div>
  );
}
