import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, Clock3, Lightbulb } from 'lucide-react';

import { getProductionKanbanPriorityGuideProps } from '../utils/productionKanbanSummary';

const TONE_STYLES = {
  danger: {
    box: 'border-rose-200 bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    icon: 'text-rose-600',
    Icon: AlertTriangle,
  },
  idle: {
    box: 'border-slate-200 bg-slate-50',
    badge: 'bg-slate-200 text-slate-700',
    icon: 'text-slate-500',
    Icon: Lightbulb,
  },
  info: {
    box: 'border-indigo-100 bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: 'text-indigo-600',
    Icon: Lightbulb,
  },
  ready: {
    box: 'border-emerald-100 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  warning: {
    box: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-600',
    Icon: Clock3,
  },
};

export default function ProductionKanbanPriorityGuide({
  discoveryLinkCandidateCount,
  onFilterModeChange,
  onOpenUploadCalendar,
  productionSummary,
}) {
  const guideProps = getProductionKanbanPriorityGuideProps({
    discoveryLinkCandidateCount,
    productionSummary,
  });
  const styles = TONE_STYLES[guideProps.tone] || TONE_STYLES.info;
  const Icon = styles.Icon;
  const isCalendarAction = guideProps.actionTarget === 'upload-calendar';
  const onAction = isCalendarAction
    ? onOpenUploadCalendar
    : (guideProps.actionFilterMode && typeof onFilterModeChange === 'function'
      ? () => onFilterModeChange(guideProps.actionFilterMode)
      : null);
  const ActionIcon = isCalendarAction ? CalendarDays : ArrowRight;

  return (
    <div
      className={`mt-4 flex flex-col gap-3 rounded-xl border px-4 py-3 md:flex-row md:items-start ${styles.box}`}
      title="Cloud에 저장된 제작 후보와 발견함 후보를 기준으로 표시만 합니다. 새 API 호출이나 저장은 실행하지 않습니다."
    >
      <Icon className={`h-5 w-5 shrink-0 ${styles.icon}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${styles.badge}`}>
            {guideProps.badge}
          </span>
          <p className="text-sm font-extrabold text-slate-900">{guideProps.title}</p>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {guideProps.description}
        </p>
        {guideProps.nextAction ? (
          <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-[11px] font-bold leading-relaxed text-slate-700">
            {guideProps.nextAction}
          </p>
        ) : null}
        {typeof onAction === 'function' ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-extrabold text-white hover:bg-slate-700"
            title={isCalendarAction
              ? '업로드 캘린더로 이동합니다. 화면 이동만으로 온라인 저장소(Azure DB) 데이터나 YouTube API 호출은 실행되지 않습니다.'
              : '안내에 해당하는 제작 단계만 표시합니다. 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다.'}
          >
            <ActionIcon className="h-4 w-4" />
            {guideProps.actionLabel}
          </button>
        ) : null}
        <p className="mt-2 text-[11px] font-bold text-slate-500">
          표시 전용 안내입니다. YouTube API 호출, 외부 자동 수집, 온라인 저장소(Azure DB) 저장은 실행하지 않습니다.
        </p>
      </div>
    </div>
  );
}
