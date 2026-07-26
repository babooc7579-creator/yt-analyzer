import { Check, ChevronRight } from 'lucide-react';

import { getHomeRadarJourneyProgress } from '../utils/homeRadarJourney';

const STATUS_STYLES = {
  complete: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  current: 'border-amber-300/50 bg-amber-400/15 text-white ring-1 ring-amber-300/20',
  ready: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100',
  upcoming: 'border-slate-700 bg-slate-950/60 text-slate-500',
};

const STATUS_LABELS = {
  complete: '완료',
  current: '현재 단계',
  ready: '준비됨',
  upcoming: '다음',
};

export default function HomeRadarJourney(props) {
  const {
    activeStageTitle,
    completedCount,
    stageCount,
    stages,
  } = getHomeRadarJourneyProgress(props);

  return (
    <div className="mt-4" aria-label="오늘의 레이더 진행 단계">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-extrabold text-slate-400">
          오늘 흐름 <span className="text-white">{completedCount}/{stageCount} 완료</span>
        </p>
        <p className="text-[11px] font-bold text-amber-200">
          지금 할 일 · {activeStageTitle}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        {stages.map((stage, index) => (
          <div key={stage.key} className="relative flex min-w-0 items-stretch">
            <a
              href={stage.href}
              className={`min-h-28 w-full rounded-lg border p-3 transition hover:-translate-y-0.5 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 ${STATUS_STYLES[stage.status]} ${stage.warning ? 'border-rose-400/50 bg-rose-500/10' : ''}`}
              title={`${stage.number}단계 ${stage.title} 위치로 이동`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current/30 text-[11px] font-black">
                  {stage.status === 'complete' ? <Check className="h-3.5 w-3.5" /> : stage.number}
                </span>
                <span className="text-[10px] font-extrabold opacity-75">{stage.warning ? '다음 행동 필요' : STATUS_LABELS[stage.status]}</span>
              </div>
              <p className="mt-3 text-xs font-black">{stage.title}</p>
              <p className="mt-1 text-[11px] font-bold opacity-75">{stage.value}</p>
              <p className="mt-2 text-[10px] font-medium leading-4 opacity-60">{stage.hint}</p>
            </a>
            {index < stages.length - 1 && (
              <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-slate-950 text-slate-500 md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
