export const getHomeCandidateWorkflowActions = ({
  hasCandidates,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
}) => ({
  productionCandidates: {
    label: '후보함',
    onClick: onOpenProductionCandidates,
    title: hasCandidates
      ? '제작 후보함에서 영상과 링크 후보를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.'
      : '제작 후보함을 열어 빈 상태 안내와 다음 행동을 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '제작 후보함 열기, 저장된 후보 조회이며 YouTube API 호출 없음',
  },
  discoveryLinks: {
    label: '발견함',
    onClick: onOpenDiscoveryLinks,
    title: '발견함에서 외부 링크를 수동 저장하거나 후보 상태를 수정합니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.',
    ariaLabel: '발견함 열기, 외부 자동 수집이나 다운로드 없음',
  },
});

export const getHomeCandidateWorkflowCardViewProps = ({
  discoveryCandidateCount = 0,
  discoveryRightsWarningCount = 0,
  productionCandidateCount = 0,
} = {}) => {
  const hasCandidates = productionCandidateCount > 0 || discoveryCandidateCount > 0;
  const hasRightsWarning = discoveryRightsWarningCount > 0;

  return {
    hasCandidates,
    hasRightsWarning,
    titleText: '3. 제작 후보로 넘기기',
  };
};

export const getHomeCandidateWorkflowStatusViewProps = ({
  discoveryCandidateCount = 0,
  discoveryRightsWarningCount = 0,
  hasRightsWarning = false,
  productionCandidateCount = 0,
} = {}) => ({
  descriptionText: hasRightsWarning
    ? `링크 후보 중 권리 확인이 필요한 항목 ${discoveryRightsWarningCount}개가 있습니다.`
    : '만들 만한 영상과 외부 발견 링크를 제작 후보로 표시하고, 나머지는 봤음/나중에 보기/제외로 정리합니다.',
  metricText: `영상 ${productionCandidateCount}개 · 링크 ${discoveryCandidateCount}개`,
});
