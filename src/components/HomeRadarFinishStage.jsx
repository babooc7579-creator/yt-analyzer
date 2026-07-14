import { ArrowDown, Rocket } from 'lucide-react';

export default function HomeRadarFinishStage({
  onOpenProductionCandidates,
  productionCandidateCount = 0,
  productionFocusCount = 0,
}) {
  const candidateCount = Math.max(0, Number(productionCandidateCount) || 0);
  const focusCount = Math.max(0, Number(productionFocusCount) || 0);
  const hasCandidates = candidateCount > 0;

  return (
    <section className={`mt-5 border p-4 ${hasCandidates ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-indigo-400/25 bg-indigo-500/10'}`} aria-labelledby="home-radar-finish-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-[11px] font-extrabold ${hasCandidates ? 'text-emerald-300' : 'text-indigo-300'}`}>STAGE 4 · 오늘의 제작 선택</p>
          <h3 id="home-radar-finish-title" className="mt-1 text-lg font-black text-white">
            {hasCandidates ? `제작 후보 ${candidateCount}개가 준비됐습니다` : '오늘 만들 한 가지를 후보 카드에서 골라주세요'}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {hasCandidates
              ? `제작 후보함에서 오늘 집중 순서를 정할 수 있습니다${focusCount > 0 ? `. 현재 오늘 집중 ${focusCount}개입니다` : ''}.`
              : '위 후보 카드의 ‘제작 후보로’를 누르면 이 단계가 열립니다. Cloud 판단 기록만 저장하며 YouTube API를 호출하지 않습니다.'}
          </p>
        </div>
        {hasCandidates ? (
          <button type="button" onClick={onOpenProductionCandidates} className="inline-flex shrink-0 items-center justify-center gap-2 bg-emerald-200 px-4 py-2.5 text-xs font-extrabold text-emerald-950 hover:bg-emerald-100">
            <Rocket className="h-4 w-4" /> 제작 후보함에서 이어가기
          </button>
        ) : (
          <a href="#today-radar-candidates" className="inline-flex shrink-0 items-center justify-center gap-2 border border-indigo-300/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-extrabold text-indigo-100 hover:bg-indigo-500/20">
            <ArrowDown className="h-4 w-4" /> 후보 판정대로 이동
          </a>
        )}
      </div>
    </section>
  );
}
