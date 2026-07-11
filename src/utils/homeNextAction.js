const toCount = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export const getHomeNextActionPanelViewProps = () => ({
  eyebrow: '다음 추천 행동',
});

export const getHomeNextAction = ({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  loadedVideoCount,
  onLoadStoredVideos,
  onOpenAddChannel,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  onOpenVault,
  openRadarCandidateCount,
  productionCandidateCount,
  savedChannelCount,
  selectedChannelCount,
}) => {
  const savedChannels = toCount(savedChannelCount);
  const selectedChannels = toCount(selectedChannelCount);
  const loadedVideos = toCount(loadedVideoCount);
  const radarCandidates = toCount(openRadarCandidateCount);
  const productionCandidates = toCount(productionCandidateCount);
  const discoveryCandidates = toCount(discoveryCandidateCount);
  const rightsWarnings = toCount(discoveryRightsWarningCount);
  const candidateTotal = productionCandidates + discoveryCandidates;

  if (savedChannels === 0) {
    return {
      tone: 'indigo',
      iconKey: 'plus',
      title: '먼저 소재 채널을 등록하세요',
      description: '채널 목록이 있어야 저장 영상을 모으고 오늘 볼 후보를 만들 수 있습니다.',
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
      title: '왼쪽에서 오늘 볼 채널을 체크하세요',
      description: '채널 선택만으로는 YouTube API를 호출하지 않습니다. 볼 범위를 먼저 정하는 단계입니다.',
      badge: '선택 필요',
      metric: `${savedChannels}개 채널 보유`,
      actionLabel: '저장 영상/채널 목록 열기',
      actionTitle: '저장 영상 화면으로 이동합니다. 이동만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다.',
      impactText: '화면 이동만 합니다. 채널 체크는 수집 실행이 아니라 볼 범위를 고르는 단계입니다.',
      onAction: onOpenVault,
    };
  }

  if (loadedVideos === 0) {
    return {
      tone: 'blue',
      iconKey: 'bookmark',
      title: '저장 영상을 먼저 불러오세요',
      description: '선택한 채널의 저장 영상만 Cloud DB에서 조회합니다. 새 YouTube API 호출은 없습니다.',
      badge: 'DB 조회',
      metric: `선택 ${selectedChannels}개`,
      actionLabel: '저장 영상 불러오기',
      actionTitle: `DB 조회: 선택 채널 ${selectedChannels}개의 저장된 영상을 불러옵니다. 새 YouTube API 호출은 없습니다.`,
      impactText: 'Cloud DB 조회입니다. 새 영상 수집이나 YouTube API 호출은 실행하지 않습니다.',
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
      impactText: '아래 후보 카드에서 누른 판단 버튼만 Cloud 판단 기록에 저장됩니다.',
    };
  }

  if (candidateTotal > 0) {
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
        impactText: '화면 이동만 합니다. 권리 상태 변경은 후보함이나 발견함에서 직접 선택할 때 Cloud에 저장됩니다.',
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
