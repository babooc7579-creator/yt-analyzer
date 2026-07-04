import { Link as LinkIcon, Rocket } from 'lucide-react';

export default function HomeCandidateWorkflowActions({
  hasCandidates,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 text-[11px] font-extrabold text-white transition hover:bg-white/15"
        onClick={onOpenProductionCandidates}
        title={hasCandidates ? '제작 후보함에서 영상과 링크 후보를 확인합니다' : '제작 후보함을 열어 빈 상태 안내와 다음 행동을 확인합니다'}
        aria-label="제작 후보함 열기"
        type="button"
      >
        <Rocket className="h-3.5 w-3.5" />
        후보함
      </button>
      <button
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 text-[11px] font-extrabold text-white/90 transition hover:bg-white/10"
        onClick={onOpenDiscoveryLinks}
        title="발견함에서 외부 링크를 저장하거나 후보 상태를 수정합니다"
        aria-label="발견함 열기"
        type="button"
      >
        <LinkIcon className="h-3.5 w-3.5" />
        발견함
      </button>
    </div>
  );
}
