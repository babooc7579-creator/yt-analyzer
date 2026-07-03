import { Bookmark, CheckCircle2 } from 'lucide-react';

import RadarDecisionPanel from './RadarDecisionPanel';

export default function RadarCandidateCompletedState({
  decisionGroups,
  decisionSummary,
  loadedDecisionCount,
  onClearDecisions,
  onOpenVault,
  onRestoreVideo,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
      <p className="text-sm font-extrabold text-emerald-100">오늘 볼 후보를 모두 처리했습니다</p>
      <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">봤음, 나중에 보기, 제작 후보, 제외로 판단한 후보는 Cloud 판단 기록에 저장되고 오늘의 레이더에서 숨겨집니다. 실수한 항목은 아래 처리 기록에서 되돌릴 수 있습니다.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-100 hover:bg-blue-500/15"
          title="저장된 영상 조회 화면으로 이동"
          aria-label="저장된 영상 조회 화면으로 이동"
        >
          <Bookmark className="h-4 w-4" /> 레퍼런스 금고 열기
        </button>
        <button
          type="button"
          onClick={onClearDecisions}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-500/15"
          title="Cloud에 저장된 판단 기록을 초기화"
          aria-label="Cloud에 저장된 오늘 레이더 판단 기록 초기화"
        >
          <CheckCircle2 className="h-4 w-4" /> 판단 기록 초기화
        </button>
      </div>
      <RadarDecisionPanel
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />
    </div>
  );
}
