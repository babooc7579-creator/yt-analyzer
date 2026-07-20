import { Star } from 'lucide-react';

import { getRadarCandidateStripHeaderViewProps } from '../utils/radarDecisionViewProps';

export default function RadarCandidateStripHeader({
  allDecisionCount,
  clearDecisionsPending,
  loadedDecisionCount,
  onClearDecisions,
  onOpenScrapbook,
  queueSummary = {},
  savedVideoCount,
}) {
  const {
    clearButtonProps,
    description,
    progressText,
    queueHint,
    scrapbookButtonProps,
    summaryItems,
    title,
  } = getRadarCandidateStripHeaderViewProps({
    allDecisionCount,
    loadedDecisionCount,
    queueSummary,
    savedVideoCount,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold text-rose-300">STAGE 3 · 오늘 후보 판단</p>
        <p className="text-sm font-extrabold text-rose-100">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-rose-100/70">
          {description}
        </p>
        <p className="mt-2 border border-emerald-300/15 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold leading-5 text-emerald-100">
          {queueHint}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-950/70">
            <div
              className="h-full rounded-full bg-rose-300 transition-all"
              style={{ width: `${progressText.percent}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="shrink-0 text-[10px] font-extrabold text-rose-100/70">
            {progressText.label}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-rose-200/10 bg-slate-950/35 px-3 py-2"
            >
              <p className="text-[11px] font-bold text-rose-100/55">{item.label}</p>
              <p className="mt-1 text-sm font-extrabold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {clearButtonProps.show && (
          <button
            type="button"
            onClick={onClearDecisions}
            disabled={clearDecisionsPending}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            title={clearDecisionsPending ? 'Cloud 판단 기록 초기화가 끝날 때까지 기다려 주세요.' : clearButtonProps.title}
            aria-label={clearButtonProps['aria-label']}
          >
            {clearDecisionsPending ? '초기화 중' : clearButtonProps.label}
          </button>
        )}
        <button
          type="button"
          onClick={onOpenScrapbook}
          className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-500/15"
          title={scrapbookButtonProps.title}
          aria-label={scrapbookButtonProps['aria-label']}
        >
          <Star className="h-4 w-4" /> {scrapbookButtonProps.label}
        </button>
      </div>
    </div>
  );
}
