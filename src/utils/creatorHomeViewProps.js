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
  latestScanText,
  loadedVideoCount,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
} = {}) => ({
  cards: [
    {
      label: '저장된 채널',
      value: savedChannelCount,
      description: '레퍼런스를 모으는 채널 자산',
    },
    {
      label: '불러온 영상',
      value: loadedVideoCount,
      description: '현재 보드에 올라온 영상',
    },
    {
      label: '스크랩 소재',
      value: savedVideoCount,
      description: '제작 후보로 남긴 영상',
    },
    {
      label: '최근 수집 상태',
      value: latestScanText,
      description: '채널의 마지막 수집 기록 기준',
      className: 'border-emerald-500/20 bg-emerald-950/30',
      labelClassName: 'text-emerald-300',
      descriptionClassName: 'text-emerald-100/70',
      valueClassName: 'text-lg',
    },
    {
      label: '터또터 후보',
      value: ttoTtoAssetCount,
      description: '노출이 멈춘 검증된 영상',
      className: 'border-rose-500/20 bg-rose-950/30',
      labelClassName: 'text-rose-300',
      descriptionClassName: 'text-rose-100/70',
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
      productionCandidateCount,
    },
  };
};
