export const getDiscoveryLinksHeaderTitleViewProps = ({ totalLinkCount = 0 } = {}) => ({
  eyebrow: 'Cloud 발견함',
  title: `저장한 링크 ${totalLinkCount}개`,
  description: 'Cloud에 저장된 수동 링크입니다. 목록이 비어 있으면 Cloud 기준으로 아직 저장된 링크가 없는 상태입니다.',
});

export const getDiscoveryLinksFilteredEmptyStateViewProps = ({ allLinkCount = 0 } = {}) => ({
  title: '조건에 맞는 링크가 없습니다.',
  description: `Cloud에는 링크 ${allLinkCount}개가 저장되어 있지만, 현재 검색어나 필터 조건 때문에 보이지 않습니다. 필터 초기화는 화면 조건만 바꾸며 저장 데이터나 외부 사이트에는 영향을 주지 않습니다.`,
  clearButtonProps: {
    label: '필터 초기화',
    title: '검색어와 필터를 모두 초기화합니다. Cloud 저장 데이터는 바꾸지 않습니다.',
    'aria-label': '발견함 화면 필터 초기화, 저장 데이터 변경 없음',
  },
});

export const getDiscoveryLinksRefreshButtonProps = () => ({
  label: '다시 조회',
  title: 'Cloud 발견함 목록을 다시 조회합니다. 외부 사이트 수집이나 저장 변경은 없습니다.',
  'aria-label': 'Cloud 발견함 다시 조회, 외부 수집이나 저장 변경 없음',
});
