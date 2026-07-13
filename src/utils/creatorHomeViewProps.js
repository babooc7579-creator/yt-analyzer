const toArray = (items) => (Array.isArray(items) ? items : []);

export const getHomeOperatingGuidelinesViewProps = () => ({
  sectionTitle: '운영 기준',
  guidelines: [
    {
      title: '수집은 API 호출',
      description: '새 영상 수집은 YouTube API를 호출합니다. 필요한 채널만 체크해서 실행하세요.',
      className: 'border-emerald-400/20 bg-emerald-500/10',
      titleClassName: 'text-emerald-200',
    },
    {
      title: '불러오기는 저장 데이터 조회',
      description: '저장된 영상 불러오기는 이미 DB에 있는 영상만 보여줍니다.',
      className: 'border-blue-400/20 bg-blue-500/10',
      titleClassName: 'text-blue-200',
    },
    {
      title: '터또터 기준',
      description: '한 번 반응이 검증된 영상을 재편집해 다시 살릴 후보를 우선 확인합니다.',
      className: 'border-orange-400/20 bg-orange-500/10',
      titleClassName: 'text-orange-200',
    },
  ],
});

export const getHomeRadarHeroViewProps = () => ({
  eyebrow: '오늘의 레이더',
  title: '오늘 볼 소재와 다음 행동을 먼저 정합니다',
  description: '발굴 → 수집 → 보관 → 분석 → 제작 → 축적 흐름으로 레퍼런스 자산을 운영합니다.',
});

export const getHomeRadarStatsGridViewProps = ({
  discoveryCandidateCount = 0,
  discoveryRightsWarningCount = 0,
  latestScanText,
  loadedVideoCount,
  productionCandidateCount = 0,
  productionFocusCount = 0,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
} = {}) => ({
  cards: [
    {
      label: '저장된 채널',
      value: savedChannelCount,
      description: 'Cloud에 저장된 채널 자산입니다. 숫자 확인만으로 YouTube API를 호출하지 않습니다.',
    },
    {
      label: '현재 화면 영상',
      value: loadedVideoCount,
      description: '현재 화면에 불러온 저장 영상 수입니다. 새 YouTube API 호출 수가 아닙니다.',
    },
    {
      label: '스크랩북 보관',
      value: savedVideoCount,
      description: 'Cloud 스크랩북에 보관한 영상입니다. 원본 영상이나 저장 영상 데이터 삭제와 다릅니다.',
    },
    {
      label: '마지막 수집 기록',
      value: latestScanText,
      description: '채널의 마지막 수집 기록 기준입니다. 현재 새 수집이 실행 중이라는 뜻은 아닙니다.',
      className: 'border-emerald-500/20 bg-emerald-950/30',
      labelClassName: 'text-emerald-300',
      descriptionClassName: 'text-emerald-100/70',
      valueClassName: 'text-lg',
    },
    {
      label: '또터또 후보',
      value: ttoTtoAssetCount,
      description: '현재 불러온 저장 영상 기준의 오래된 반응 후보입니다. 예측 점수가 아니라 판단 보조 신호입니다.',
      className: 'border-rose-500/20 bg-rose-950/30',
      labelClassName: 'text-rose-300',
      descriptionClassName: 'text-rose-100/70',
    },
    {
      label: '제작 후보',
      value: productionCandidateCount,
      description: 'Cloud 판단 기록에서 제작 후보로 표시한 저장 영상입니다. 숫자 확인만으로 저장이나 API 호출은 실행하지 않습니다.',
      className: 'border-indigo-500/20 bg-indigo-950/30',
      labelClassName: 'text-indigo-300',
      descriptionClassName: 'text-indigo-100/70',
    },
    {
      label: '오늘 집중',
      value: productionFocusCount,
      description: 'Cloud 판단 기록에서 오늘 집중으로 고정한 영상입니다. 숫자 확인만으로 저장이나 YouTube API 호출은 실행하지 않습니다.',
      className: 'border-cyan-500/20 bg-cyan-950/30',
      labelClassName: 'text-cyan-300',
      descriptionClassName: 'text-cyan-100/70',
    },
    {
      label: '발견 링크 후보',
      value: discoveryCandidateCount,
      description: discoveryRightsWarningCount > 0
        ? `Cloud 발견함에서 제작 후보로 표시한 링크입니다. 권리 확인 필요 ${discoveryRightsWarningCount}개를 먼저 확인하세요.`
        : 'Cloud 발견함에서 제작 후보로 표시한 링크입니다. 외부 자동 수집이나 다운로드 결과가 아닙니다.',
      className: 'border-amber-500/20 bg-amber-950/30',
      labelClassName: 'text-amber-300',
      descriptionClassName: 'text-amber-100/70',
    },
  ],
});

export const getCreatorHomeViewProps = ({
  clearRadarDecisions,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  isVideoSaved,
  latestScanText,
  loadStoredVideosForSelectedChannels,
  markRadarVideoStatus,
  onOpenView,
  openRadarCandidateCount,
  productionCandidateCount,
  productionFocusCount,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
  selectedChannelCount,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) => {
  const channelList = toArray(savedChannels);
  const savedVideoList = toArray(savedVideos);
  const videoList = toArray(videos);

  return {
    actionShortcutsProps: {
      onOpenAddChannel: () => onOpenView({ id: 'ops-add-channel' }),
      onOpenDiscoveryLinks: () => onOpenView({ id: 'vault-sources' }),
      onOpenSelectedScan: () => onOpenView({ id: 'ops-selected-scan' }),
      onOpenVault: () => onOpenView({ id: 'vault-all' }),
    },
    radarCandidateStripProps: {
      videos: videoList,
      savedVideos: savedVideoList,
      videoUserRecords,
      isVideoSaved,
      onToggleScrap: toggleScrapVideo,
      onMarkVideoStatus: markRadarVideoStatus,
      onPromoteToProduction: promoteVideoToProduction,
      onRestoreVideo: restoreVideoToRadar,
      onClearDecisions: clearRadarDecisions,
      onLoadStoredVideos: loadStoredVideosForSelectedChannels,
      selectedChannelCount,
      onOpenVault: () => onOpenView({ id: 'vault-all' }),
      onOpenScrapbook: () => onOpenView({ id: 'studio-scrapbook' }),
      onOpenProductionCandidates: () => onOpenView({ id: 'studio-candidates' }),
    },
    radarSummaryProps: {
      savedChannelCount: channelList.length,
      loadedVideoCount: videoList.length,
      savedVideoCount: savedVideoList.length,
      latestScanText,
      onOpenAddChannel: () => onOpenView({ id: 'ops-add-channel' }),
      onLoadStoredVideos: loadStoredVideosForSelectedChannels,
      selectedChannelCount,
      ttoTtoAssetCount,
      openRadarCandidateCount,
      discoveryCandidateCount,
      discoveryRightsWarningCount,
      onOpenDiscoveryLinks: () => onOpenView({ id: 'vault-sources' }),
      onOpenProductionCandidates: () => onOpenView({ id: 'studio-candidates' }),
      onOpenSelectedScan: () => onOpenView({ id: 'ops-selected-scan' }),
      onOpenVault: () => onOpenView({ id: 'vault-all' }),
      productionCandidateCount,
      productionFocusCount,
    },
  };
};
