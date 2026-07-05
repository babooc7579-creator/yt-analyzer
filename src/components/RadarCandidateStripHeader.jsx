import { Star } from 'lucide-react';

export default function RadarCandidateStripHeader({
  allDecisionCount,
  onClearDecisions,
  onOpenScrapbook,
  queueSummary = {},
  savedVideoCount,
}) {
  const {
    candidateLimit = 6,
    hiddenDecisionCount = allDecisionCount,
    highPriorityCount = 0,
    shownCandidateCount = 0,
    visibleQueueCount = 0,
  } = queueSummary;

  const summaryItems = [
    { label: '대기 후보', value: `${visibleQueueCount}개` },
    { label: '오늘 표시', value: `${shownCandidateCount}/${candidateLimit}` },
    { label: '우선 검토', value: `${highPriorityCount}개` },
    { label: '숨긴 기록', value: `${hiddenDecisionCount}개` },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-rose-100">오늘 볼 후보</p>
        <p className="mt-1 text-xs leading-relaxed text-rose-100/70">
          저장된 영상 중 아직 판단하지 않은 항목을 점수순으로 정렬하고, 상위 후보를 오늘 검토 목록으로 보여줍니다.
          새 YouTube 스캔이 아니라 이미 불러온 데이터 기준입니다.
        </p>
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
        {allDecisionCount > 0 && (
          <button
            type="button"
            onClick={onClearDecisions}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900"
            title="Cloud에 저장된 오늘 판단 기록을 초기화합니다"
            aria-label="Cloud에 저장된 오늘 레이더 판단 기록 초기화"
          >
            판단 초기화
          </button>
        )}
        <button
          type="button"
          onClick={onOpenScrapbook}
          className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-500/15"
          title="Cloud 스크랩북 화면으로 이동"
          aria-label={`Cloud 스크랩북 화면으로 이동, 스크랩 ${savedVideoCount}개`}
        >
          <Star className="h-4 w-4" /> 스크랩 {savedVideoCount}개
        </button>
      </div>
    </div>
  );
}
