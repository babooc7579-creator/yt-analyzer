import { Bookmark, CheckCircle2, ListChecks, Plus, RefreshCw, Rocket } from 'lucide-react';

const TONE_STYLES = {
  amber: {
    border: 'border-amber-400/25 bg-amber-500/10',
    icon: 'bg-amber-400/15 text-amber-200',
    eyebrow: 'text-amber-200',
    badge: 'bg-amber-400/15 text-amber-100',
    button: 'bg-amber-200 text-amber-950 hover:bg-amber-100',
  },
  blue: {
    border: 'border-blue-400/25 bg-blue-500/10',
    icon: 'bg-blue-400/15 text-blue-200',
    eyebrow: 'text-blue-200',
    badge: 'bg-blue-400/15 text-blue-100',
    button: 'bg-blue-100 text-blue-950 hover:bg-white',
  },
  emerald: {
    border: 'border-emerald-400/25 bg-emerald-500/10',
    icon: 'bg-emerald-400/15 text-emerald-200',
    eyebrow: 'text-emerald-200',
    badge: 'bg-emerald-400/15 text-emerald-100',
    button: 'bg-emerald-100 text-emerald-950 hover:bg-white',
  },
  indigo: {
    border: 'border-indigo-400/25 bg-indigo-500/10',
    icon: 'bg-indigo-400/15 text-indigo-200',
    eyebrow: 'text-indigo-200',
    badge: 'bg-indigo-400/15 text-indigo-100',
    button: 'bg-indigo-100 text-indigo-950 hover:bg-white',
  },
  rose: {
    border: 'border-rose-400/25 bg-rose-500/10',
    icon: 'bg-rose-400/15 text-rose-200',
    eyebrow: 'text-rose-200',
    badge: 'bg-rose-400/15 text-rose-100',
    button: 'bg-rose-100 text-rose-950 hover:bg-white',
  },
};

const toCount = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

function getNextAction({
  discoveryCandidateCount,
  loadedVideoCount,
  onLoadStoredVideos,
  onOpenAddChannel,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  openRadarCandidateCount,
  productionCandidateCount,
  savedChannelCount,
  selectedChannelCount,
}) {
  const savedChannels = toCount(savedChannelCount);
  const selectedChannels = toCount(selectedChannelCount);
  const loadedVideos = toCount(loadedVideoCount);
  const radarCandidates = toCount(openRadarCandidateCount);
  const productionCandidates = toCount(productionCandidateCount);
  const discoveryCandidates = toCount(discoveryCandidateCount);
  const candidateTotal = productionCandidates + discoveryCandidates;

  if (savedChannels === 0) {
    return {
      tone: 'indigo',
      icon: Plus,
      title: '먼저 소재 채널을 등록하세요',
      description: '채널 목록이 있어야 저장 영상을 모으고 오늘 볼 후보를 만들 수 있습니다.',
      badge: '준비 작업',
      metric: '채널 0개',
      actionLabel: '채널 등록 열기',
      actionTitle: '채널 등록 화면으로 이동합니다.',
      onAction: onOpenAddChannel,
    };
  }

  if (selectedChannels === 0) {
    return {
      tone: 'amber',
      icon: ListChecks,
      title: '왼쪽에서 오늘 볼 채널을 체크하세요',
      description: '채널 선택만으로는 YouTube API를 호출하지 않습니다. 볼 범위를 먼저 정하는 단계입니다.',
      badge: '선택 필요',
      metric: `${savedChannels}개 채널 보유`,
    };
  }

  if (loadedVideos === 0) {
    return {
      tone: 'blue',
      icon: Bookmark,
      title: '저장 영상을 먼저 불러오세요',
      description: '선택한 채널의 저장 영상만 Cloud DB에서 조회합니다. 새 YouTube API 호출은 없습니다.',
      badge: 'DB 조회',
      metric: `선택 ${selectedChannels}개`,
      actionLabel: '저장 영상 불러오기',
      actionTitle: `DB 조회: 선택 채널 ${selectedChannels}개의 저장된 영상을 불러옵니다.`,
      onAction: onLoadStoredVideos,
    };
  }

  if (radarCandidates > 0) {
    return {
      tone: 'rose',
      icon: CheckCircle2,
      title: '아래 오늘 후보부터 판단하세요',
      description: '좋은 후보는 제작 후보로 넘기고, 아닌 영상은 봤음/나중에 보기/제외로 정리합니다.',
      badge: '오늘 검토',
      metric: `${radarCandidates}개 남음`,
    };
  }

  if (candidateTotal > 0) {
    return {
      tone: 'emerald',
      icon: Rocket,
      title: '제작 후보함을 열어 다음 콘텐츠를 고르세요',
      description: '이미 후보로 남긴 영상과 발견 링크를 한곳에서 확인할 수 있습니다.',
      badge: '제작 준비',
      metric: `후보 ${candidateTotal}개`,
      actionLabel: '후보함 열기',
      actionTitle: '제작 후보함에서 영상 후보와 링크 후보를 확인합니다.',
      onAction: onOpenProductionCandidates,
    };
  }

  return {
    tone: 'emerald',
    icon: RefreshCw,
    title: '볼 후보가 없다면 새 영상 수집 화면으로 이동하세요',
    description: '수집 화면으로 이동한 뒤 선택 채널만 새 영상 여부를 확인합니다. 이 단계에서 YouTube API를 사용할 수 있습니다.',
    badge: 'YouTube API 가능',
    metric: '후보 정리 완료',
    actionLabel: '수집 화면 열기',
    actionTitle: '선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집이 실행되지는 않습니다.',
    onAction: onOpenSelectedScan,
  };
}

export default function HomeNextActionPanel(props) {
  const nextAction = getNextAction(props);
  const styles = TONE_STYLES[nextAction.tone] || TONE_STYLES.indigo;
  const Icon = nextAction.icon;

  return (
    <div className={`mt-4 rounded-2xl border p-4 ${styles.border}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-[11px] font-extrabold ${styles.eyebrow}`}>다음 추천 행동</p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${styles.badge}`}>
                {nextAction.badge}
              </span>
            </div>
            <h4 className="mt-1 text-base font-black text-white">{nextAction.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{nextAction.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs font-black text-white">
            {nextAction.metric}
          </p>
          {nextAction.onAction && nextAction.actionLabel && (
            <button
              type="button"
              onClick={nextAction.onAction}
              className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${styles.button}`}
              title={nextAction.actionTitle}
              aria-label={nextAction.actionTitle || nextAction.actionLabel}
            >
              {nextAction.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
