export const getHomeCandidateWorkflowActions = ({
  hasCandidates,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
}) => ({
  productionCandidates: {
    onClick: onOpenProductionCandidates,
    title: hasCandidates
      ? '제작 후보함에서 영상과 링크 후보를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.'
      : '제작 후보함을 열어 빈 상태 안내와 다음 행동을 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '제작 후보함 열기, 저장된 후보 조회이며 YouTube API 호출 없음',
  },
  discoveryLinks: {
    onClick: onOpenDiscoveryLinks,
    title: '발견함에서 외부 링크를 수동 저장하거나 후보 상태를 수정합니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.',
    ariaLabel: '발견함 열기, 외부 자동 수집이나 다운로드 없음',
  },
});
