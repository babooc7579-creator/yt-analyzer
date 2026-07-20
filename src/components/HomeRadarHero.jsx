import { CheckCircle2, Sparkles } from 'lucide-react';

import { getHomeRadarHeroViewProps } from '../utils/creatorHomeViewProps';

export default function HomeRadarHero({
  openRadarCandidateCount = 0,
  productionFocusCount = 0,
}) {
  const viewProps = getHomeRadarHeroViewProps();
  const candidateCount = Math.max(0, Number(openRadarCandidateCount) || 0);
  const focusCount = Math.max(0, Number(productionFocusCount) || 0);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="rounded-2xl bg-indigo-500/15 p-4">
          <Sparkles className="h-8 w-8 text-indigo-300" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-indigo-300">{viewProps.eyebrow}</p>
          <h3 className="mt-1 text-2xl font-extrabold text-white">{viewProps.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{viewProps.description}</p>
        </div>
      </div>
      <div className="shrink-0 border-l-2 border-indigo-400/30 pl-4 lg:max-w-xs">
        <p className="flex items-center gap-2 text-xs font-extrabold text-indigo-200">
          <CheckCircle2 className="h-4 w-4" /> 오늘의 완료 기준
        </p>
        <p className="mt-2 text-sm font-black text-white">
          후보를 검토하고 만들 한 가지를 정합니다
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          판정 대기 {candidateCount}개 · 오늘 집중 {focusCount}개
        </p>
      </div>
    </div>
  );
}
