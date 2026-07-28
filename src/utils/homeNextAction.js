import { hasEmptyStoredVideoLoad } from './homeRadarJourney';

const toCount = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export const getHomeNextActionPanelViewProps = () => ({
  eyebrow: '다음 추천 행동',
});

export const getHomeNextAction = ({
  channelsLoading = false,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  loadedVideoCount,
  onLoadStoredVideos,
  onOpenAddChannel,
  onOpenChannelWatchlist,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  onOpenVault,
  openRadarCandidateCount,
  productionCandidateCount,
  productionFocusCount,
  savedChannelCount,
  selectedChannelCount,
  storedVideoLoadResult,
}) => {
  const savedChannels = toCount(savedChannelCount);
  const selectedChannels = toCount(selectedChannelCount);
  const loadedVideos = toCount(loadedVideoCount);
  const radarCandidates = toCount(openRadarCandidateCount);
  const productionCandidates = toCount(productionCandidateCount);
  const productionFocusCandidates = toCount(productionFocusCount);
  const discoveryCandidates = toCount(discoveryCandidateCount);
  const rightsWarnings = toCount(discoveryRightsWarningCount);
  const candidateTotal = productionCandidates + discoveryCandidates;

  if (channelsLoading) {
    return {
      tone: 'blue',
      iconKey: 'refresh',
      title: '온라인 저장소(Azure DB)의 채널 목록을 확인하고 있습니다',
      description: '등록된 채널 목록 조회가 끝나면 오늘 할 일을 이어서 안내합니다.',
      badge: '온라인 저장소(Azure DB) 조회',
      metric: '조회 중',
      actionLabel: '',
      impactText: '채널 목록 조회이며 새 영상 수집이나 YouTube API 호출은 실행하지 않습니다.',
    };
  }

  if (savedChannels === 0) {
    return {
      tone: 'indigo',
      iconKey: 'plus',
      title: '먼저 소재 채널을 등록하세요',
      description: '채널 목록이 있어야 수집 영상을 모으고 오늘 볼 후보를 만들 수 있습니다.',
      badge: '준비 작업',
      metric: '채널 0개',
      actionLabel: '채널 등록 열기',
      actionTitle: '채널 등록 화면으로 이동합니다.',
      impactText: '화면 이동만 합니다. 채널 저장은 사용자가 등록 버튼을 눌렀을 때만 실행됩니다.',
      onAction: onOpenAddChannel,
    };
  }

  if (selectedChannels === 0) {
    return {
      tone: 'amber',
      iconKey: 'listChecks',
      title: '오늘 볼 채널을 먼저 고르세요',
      description: '채널 선택만으로는 YouTube API를 호출하지 않습니다. 볼 범위를 먼저 정하는 단계입니다.',
      badge: '선택 필요',
      metric: `${savedChannels}개 채널 보유`,
      actionLabel: '오늘 볼 채널 열기',
      actionTitle: '오늘 볼 채널 화면으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 조회나 YouTube API 호출은 실행되지 않습니다.',
      impactText: '화면 이동만 합니다. 채널 체크는 수집 실행이 아니라 볼 범위를 고르는 단계입니다.',
      onAction: onOpenChannelWatchlist || onOpenVault,
    };
  }

  if (hasEmptyStoredVideoLoad(storedVideoLoadResult)) {
    return {
      tone: 'amber',
      iconKey: 'listChecks',
      title: '선택한 채널에는 수집된 영상 정보가 없습니다',
      description: '조회는 정상적으로 끝났습니다. 다른 채널을 골라 다시 조회하거나, 선택 채널의 새 영상 수집 화면으로 이동하세요.',
      badge: '다음 경로 선택',
      metric: `선택 ${selectedChannels}개 · 영상 0개`,
      actionLabel: '다른 채널 고르기',
      actionTitle: '오늘 볼 채널 화면으로 이동해 다른 채널을 선택합니다. 이동과 선택만으로 YouTube API를 호출하지 않습니다.',
      impactText: '새 영상 수집 화면 열기는 화면 이동만 합니다. 실제 수집 버튼을 누르기 전에는 YouTube API를 호출하지 않습니다.',
      onAction: onOpenChannelWatchlist || onOpenVault,
      secondaryActions: [
        {
          label: '새 영상 수집 화면 열기',
          title: '선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집은 실행되지 않으며, 실제 수집 버튼에서 YouTube API를 사용할 수 있습니다.',
          onAction: onOpenSelectedScan,
        },
      ].filter((action) => typeof action.onAction === 'function'),
    };
  }

  if (loadedVideos === 0) {
    return {
      tone: 'blue',
      iconKey: 'bookmark',
      title: '수집 영상을 먼저 불러오세요',
      description: '선택한 채널의 수집 영상만 온라인 저장소(Azure DB)에서 조회합니다. 새 YouTube API 호출은 없습니다.',
      badge: 'DB 조회',
      metric: `선택 ${selectedChannels}개`,
      actionLabel: '수집 영상 목록 불러오기',
      actionTitle: `DB 조회: 선택 채널 ${selectedChannels}개의 수집된 영상 정보를 불러옵니다. 새 YouTube API 호출은 없습니다.`,
      impactText: '온라인 저장소(Azure DB) 조회입니다. 새 영상 수집이나 YouTube API 호출은 실행하지 않습니다.',
      onAction: onLoadStoredVideos,
    };
  }

  if (radarCandidates > 0) {
    return {
      tone: 'rose',
      iconKey: 'checkCircle',
      title: '아래 오늘 후보부터 판단하세요',
      description: '좋은 후보는 제작 후보로 표시하고, 아닌 영상은 봤음/나중에 보기/제외로 정리합니다.',
      badge: '오늘 검토',
      metric: `${radarCandidates}개 남음`,
      actionHref: '#today-radar-candidates',
      actionLabel: '후보 판정 시작',
      actionTitle: '같은 화면의 오늘 후보 판정 영역으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 실행되지 않습니다.',
      impactText: '아래 후보 카드에서 누른 판단 버튼만 온라인 저장소(Azure DB)의 판단 기록에 저장됩니다.',
    };
  }

  if (candidateTotal > 0 || productionFocusCandidates > 0) {
    if (rightsWarnings > 0) {
      return {
        tone: 'amber',
        iconKey: 'shieldAlert',
        title: '권리 확인 필요한 후보를 먼저 정리하세요',
        description: '제작 전에 사용해도 되는 링크인지 확인해야 할 발견 링크 후보가 있습니다.',
        badge: '확인 필요',
        metric: `권리 확인 ${rightsWarnings}개`,
        actionLabel: '후보함에서 확인',
        actionTitle: '제작 후보함에서 권리 확인이 필요한 발견 링크 후보를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
        impactText: '화면 이동만 합니다. 권리 상태 변경은 후보함이나 발견함에서 직접 선택할 때 온라인 저장소(Azure DB)에 저장됩니다.',
        onAction: onOpenProductionCandidates,
      };
    }

    if (productionFocusCandidates > 0) {
      return {
        tone: 'emerald',
        iconKey: 'rocket',
        title: '오늘 집중 후보부터 이어서 결정하세요',
        description: '직접 고정한 영상만 모아둔 오늘 집중 영역에서 다음 제작 행동을 정합니다.',
        badge: '오늘 집중',
        metric: `${productionFocusCandidates}개`,
        actionLabel: '오늘 집중 보기',
        actionTitle: '제작 후보함의 오늘 집중 영역을 엽니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
        impactText: '화면 이동만 합니다. 집중 해제나 제작 상태 변경은 후보함 안에서 직접 선택할 때 온라인 저장소(Azure DB)에 저장됩니다.',
        onAction: onOpenProductionCandidates,
      };
    }

    return {
      tone: 'emerald',
      iconKey: 'rocket',
      title: '제작 후보함을 열어 다음 콘텐츠를 고르세요',
      description: '후보로 표시한 영상과 발견 링크를 한곳에서 확인할 수 있습니다.',
      badge: '제작 준비',
      metric: `후보 ${candidateTotal}개`,
      actionLabel: '후보함 열기',
      actionTitle: '제작 후보함에서 영상 후보와 링크 후보를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
      impactText: '화면 이동만 합니다. 후보 상태 변경은 제작 후보함 안에서 직접 선택할 때 저장됩니다.',
      onAction: onOpenProductionCandidates,
    };
  }

  return {
    tone: 'emerald',
    iconKey: 'refresh',
    title: '볼 후보가 없다면 새 영상 수집 화면으로 이동하세요',
    description: '수집 화면으로 이동한 뒤 선택 채널만 새 영상 여부를 확인합니다. 이 단계에서 YouTube API를 사용할 수 있습니다.',
    badge: 'YouTube API 가능',
    metric: '후보 정리 완료',
    actionLabel: '수집 화면 열기',
    actionTitle: '선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집이 실행되지는 않습니다.',
    impactText: '화면 이동만 합니다. 실제 수집 버튼을 누를 때 YouTube API를 사용할 수 있습니다.',
    onAction: onOpenSelectedScan,
  };
};
