import { Bookmark, Link as LinkIcon, Rocket, Sparkles } from 'lucide-react';

function SummaryCard({ label, value, description, className = 'border-slate-800 bg-slate-950', labelClassName = 'text-slate-500', descriptionClassName = 'text-slate-400', valueClassName = 'text-3xl' }) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className={`text-[11px] font-bold ${labelClassName}`}>{label}</p>
      <p className={`mt-2 font-extrabold text-white ${valueClassName}`}>{value}</p>
      <p className={`mt-1 text-xs ${descriptionClassName}`}>{description}</p>
    </div>
  );
}

function WorkflowCard({ title, description, value, icon: Icon, className, titleClassName, iconClassName, descriptionClassName }) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${descriptionClassName}`}>{description}</p>
      <p className="mt-3 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function CandidateWorkflowCard({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
}) {
  const hasCandidates = productionCandidateCount > 0 || discoveryCandidateCount > 0;

  return (
    <div className={`rounded-2xl border p-4 ${discoveryRightsWarningCount > 0 ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${discoveryRightsWarningCount > 0 ? 'text-amber-100' : 'text-emerald-100'}`}>3. 제작 후보로 넘기기</p>
        <Rocket className={`h-4 w-4 ${discoveryRightsWarningCount > 0 ? 'text-amber-200' : 'text-emerald-200'}`} />
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${discoveryRightsWarningCount > 0 ? 'text-amber-100/80' : 'text-emerald-100/70'}`}>
        {discoveryRightsWarningCount > 0
          ? `링크 후보 중 권리 확인이 필요한 항목 ${discoveryRightsWarningCount}개가 있습니다.`
          : '만들 만한 영상과 외부 발견 링크를 제작 후보로 모으고, 나머지는 봄/나중/제외로 정리합니다.'}
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

export default function HomeRadarSummary({
  savedChannelCount,
  loadedVideoCount,
  savedVideoCount,
  latestScanText,
  ttoTtoAssetCount,
  openRadarCandidateCount,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
}) {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-indigo-500/15 p-4">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-indigo-300">오늘의 레이더</p>
          <h3 className="mt-1 text-2xl font-extrabold text-white">오늘 볼 소재와 다음 행동을 먼저 정합니다</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">발굴 → 수집 → 보관 → 분석 → 제작 → 축적 흐름으로 레퍼런스 자산을 운영합니다.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="저장된 채널"
          value={savedChannelCount}
          description="레퍼런스를 모으는 채널 자산"
        />
        <SummaryCard
          label="불러온 영상"
          value={loadedVideoCount}
          description="현재 보드에 올라온 영상"
        />
        <SummaryCard
          label="스크랩 소재"
          value={savedVideoCount}
          description="제작 후보로 남긴 영상"
        />
        <SummaryCard
          label="최근 수집 상태"
          value={latestScanText}
          description="채널의 마지막 수집 기록 기준"
          className="border-emerald-500/20 bg-emerald-950/30"
          labelClassName="text-emerald-300"
          descriptionClassName="text-emerald-100/70"
          valueClassName="text-lg"
        />
        <SummaryCard
          label="터또터 후보"
          value={ttoTtoAssetCount}
          description="노출이 멈춘 검증된 영상"
          className="border-rose-500/20 bg-rose-950/30"
          labelClassName="text-rose-300"
          descriptionClassName="text-rose-100/70"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold text-indigo-200">오늘 작업 흐름</p>
            <p className="mt-1 text-sm text-slate-400">저장된 데이터를 먼저 보고, 괜찮은 후보만 제작 후보로 넘깁니다.</p>
          </div>
          <p className="text-[11px] font-bold text-emerald-200">이 영역은 DB 조회 중심입니다. 새 수집은 선택 스캔 버튼에서만 실행됩니다.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <WorkflowCard
            title="1. 저장된 영상 불러오기"
            description="이미 저장된 영상만 화면에 올립니다. YouTube API를 새로 호출하지 않습니다."
            value={`${loadedVideoCount}개`}
            icon={Bookmark}
            className="border-blue-400/20 bg-blue-500/10"
            titleClassName="text-blue-100"
            iconClassName="text-blue-200"
            descriptionClassName="text-blue-100/70"
          />
          <WorkflowCard
            title="2. 오늘 후보 판단"
            description="레이더가 먼저 볼 후보를 추려 보여줍니다. 본 영상은 다시 보이지 않게 정리됩니다."
            value={`${openRadarCandidateCount}개 남음`}
            icon={Sparkles}
            className="border-rose-400/20 bg-rose-500/10"
            titleClassName="text-rose-100"
            iconClassName="text-rose-200"
            descriptionClassName="text-rose-100/70"
          />
          <CandidateWorkflowCard
            discoveryCandidateCount={discoveryCandidateCount}
            discoveryRightsWarningCount={discoveryRightsWarningCount}
            onOpenDiscoveryLinks={onOpenDiscoveryLinks}
            onOpenProductionCandidates={onOpenProductionCandidates}
            productionCandidateCount={productionCandidateCount}
          />
        </div>
      </div>
    </>
  );
}
