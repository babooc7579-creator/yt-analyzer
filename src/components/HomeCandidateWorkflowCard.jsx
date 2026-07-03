import { Link as LinkIcon, Rocket } from 'lucide-react';

export default function HomeCandidateWorkflowCard({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
}) {
  const hasCandidates = productionCandidateCount > 0 || discoveryCandidateCount > 0;
  const hasRightsWarning = discoveryRightsWarningCount > 0;

  return (
    <div className={`rounded-2xl border p-4 ${hasRightsWarning ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${hasRightsWarning ? 'text-amber-100' : 'text-emerald-100'}`}>3. 제작 후보로 넘기기</p>
        <Rocket className={`h-4 w-4 ${hasRightsWarning ? 'text-amber-200' : 'text-emerald-200'}`} />
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${hasRightsWarning ? 'text-amber-100/80' : 'text-emerald-100/70'}`}>
        {hasRightsWarning
          ? `링크 후보 중 권리 확인이 필요한 항목 ${discoveryRightsWarningCount}개가 있습니다.`
          : '만들 만한 영상과 외부 발견 링크를 제작 후보로 모으고, 나머지는 봤음/나중에 보기/제외로 정리합니다.'}
      </p>
      <p className="mt-3 text-lg font-black text-white">{`영상 ${productionCandidateCount}개 · 링크 ${discoveryCandidateCount}개`}</p>

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
    </div>
  );
}
