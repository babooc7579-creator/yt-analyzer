import { CalendarDays } from 'lucide-react';

import { getProductionKanbanScheduleSummaryViewProps } from '../utils/productionKanbanSummary';

export default function ProductionKanbanScheduleSummary({ productionSummary }) {
  const {
    activeWithoutDateText,
    label,
    nextScheduledText,
    nextScheduledTitle,
    overdueText,
  } = getProductionKanbanScheduleSummaryViewProps({ productionSummary });

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
      <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700">
        <CalendarDays className="h-3 w-3" /> {label}
      </p>
      <p className="mt-1 text-sm font-black text-amber-950">
        {nextScheduledText}
      </p>
      {nextScheduledTitle && (
        <p
          className="mt-1 line-clamp-2 break-words text-[10px] font-bold text-amber-800"
          title={nextScheduledTitle}
        >
          {nextScheduledTitle}
        </p>
      )}
      {overdueText && (
        <p className="mt-1 text-[10px] font-bold text-rose-600">
          {overdueText}
        </p>
      )}
      {activeWithoutDateText && (
        <p className="mt-1 text-[10px] font-bold text-amber-700">
          {activeWithoutDateText}
        </p>
      )}
    </div>
  );
}
