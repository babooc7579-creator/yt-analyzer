import { hasCopyableUrlValue } from './copyUrlButtonProps';

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

export const getDiscoveryLinkFormHeaderViewProps = () => ({
  title: '수동 링크 저장',
  description: '링크와 메모만 Cloud에 저장합니다. 외부 사이트 자동 수집, 다운로드, AI 분석은 실행하지 않습니다.',
});

export const getDiscoveryLinkMemoFieldViewProps = () => ({
  label: '메모',
  placeholder: '왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요.',
  'aria-label': '발견 링크 메모',
});

export const getDiscoveryLinkRiskyCandidateHintViewProps = () => ({
  title: '사용 금지 링크를 제작 후보로 저장하려고 합니다',
  description: '저장 버튼을 누르면 한 번 더 확인합니다. 이 작업은 Cloud 발견함 상태만 바꾸며, 사용 허가나 권리 확인 완료를 의미하지 않습니다.',
});

export const getDiscoveryLinkSafetyNoticeViewProps = () => ({
  title: '안전 기준',
  description: '저장 영상 조회와 같은 Cloud DB 작업입니다. 선택 채널 새 영상 수집이나 외부 사이트 크롤링을 실행하지 않습니다.',
});

export const getDiscoveryLinkSearchBoxViewProps = () => ({
  label: '발견 링크 검색',
  inputPlaceholder: '제목, 메모, URL 검색',
  inputAriaLabel: '발견 링크 검색어',
  clearButtonProps: {
    'aria-label': '검색어 지우기',
    title: '검색어 지우기',
  },
});

export const getDiscoveryLinksHeaderActionsViewProps = ({
  filteredLinkCount = 0,
  loading = false,
  onOpenProductionCandidates,
  onRefresh,
  saving = false,
  urlList,
} = {}) => ({
  copyUrlButtonProps: {
    url: urlList,
    label: 'URL 목록 복사',
    copiedLabel: '목록 복사 완료',
    disabled: !hasCopyableUrlValue(urlList),
    ariaLabel: `현재 조건에 맞는 발견 링크 ${filteredLinkCount}개 URL 목록 복사`,
    title: '현재 필터와 검색 조건에 맞는 발견 링크 제목, URL, 상태를 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다.',
  },
  productionCandidatesButtonProps: {
    disabled: !onOpenProductionCandidates || loading || saving,
    onClick: onOpenProductionCandidates,
    title: '제작 후보함을 열어 후보로 표시한 영상과 발견 링크를 확인합니다. 화면 이동만 하며 새 YouTube API 호출이나 외부 수집은 없습니다.',
    'aria-label': '제작 후보함 보기, 화면 이동만 하며 새 YouTube API 호출이나 외부 수집 없음',
    type: 'button',
  },
  productionCandidatesButtonLabel: '후보함 보기',
  refreshButtonProps: {
    disabled: loading || saving,
    onClick: onRefresh,
    title: 'Cloud 발견함 목록을 다시 조회합니다. 외부 사이트를 새로 수집하지 않습니다.',
    'aria-label': 'Cloud 발견함 목록 다시 조회, 외부 수집 없음',
    type: 'button',
  },
  refreshButtonLabel: '새로고침',
  isRefreshing: loading,
});

export const getDiscoveryLinksLoadingStateViewProps = () => ({
  message: 'Cloud 발견함을 불러오는 중입니다.',
});

export const getDiscoveryLinksActiveFilterSummaryViewProps = ({ filteredLinkCount = 0 } = {}) => ({
  message: `현재 조건에 맞는 링크 ${filteredLinkCount}개를 보고 있습니다.`,
});

export const getDiscoveryStatusFilterGroupViewProps = () => ({
  title: '검토 상태별 보기',
});

export const getDiscoveryRightsFilterGroupViewProps = () => ({
  title: '권리 상태별 보기',
});

export const getDiscoveryStatusFilterButtonProps = ({ option = {} } = {}) => ({
  title: `${option.label} 상태 링크만 보기`,
  'aria-label': `${option.label} 상태 링크 ${option.count}개 보기`,
});

export const getDiscoveryRightsFilterButtonProps = ({ option = {} } = {}) => ({
  title: `${option.label} 권리 상태 링크만 보기`,
  'aria-label': `${option.label} 권리 상태 링크 ${option.count}개 보기`,
});

export const getDiscoveryLinkStatusFieldsViewProps = () => ({
  statusField: {
    label: '검토 상태',
    selectProps: {
      title: '발견 링크 검토 상태 선택',
      'aria-label': '발견 링크 검토 상태 선택',
    },
  },
  rightsField: {
    label: '권리 상태',
    selectProps: {
      title: '사용자가 표시하는 권리 상태입니다. 선택만으로 사용 허가나 권리 확인 완료가 되지는 않습니다.',
      'aria-label': '발견 링크 권리 상태 선택, 사용 허가나 권리 확인 완료 의미 아님',
    },
  },
});

export const getDiscoveryLinkSubmitButtonViewProps = ({
  duplicateLink,
  saving = false,
} = {}) => ({
  buttonProps: {
    title: '링크와 메모를 Cloud 발견함에 저장합니다. 외부 사이트 크롤링은 하지 않습니다.',
    'aria-label': 'Cloud 발견함에 링크 저장',
    type: 'submit',
  },
  label: saving ? 'Cloud 저장 중' : duplicateLink ? '이미 저장된 링크' : '링크 저장',
});

export const getDiscoveryLinkUrlFieldViewProps = ({ duplicateLink, urlPreview } = {}) => ({
  label: '원본 링크',
  inputAriaLabel: '저장할 원본 링크 URL',
  previewHostText: urlPreview?.host ? `출처 도메인: ${urlPreview.host}` : '',
  duplicateWarning: duplicateLink ? {
    title: '이미 Cloud 발견함에 저장된 링크입니다.',
    description: '새로 저장하지 말고 오른쪽 목록에서 기존 항목을 수정하세요.',
  } : null,
});

export const getDiscoveryLinkStatusControlsViewProps = ({ title = '발견 링크' } = {}) => ({
  statusSelectProps: {
    title: '검토 상태 변경 - Cloud 발견함 기록에 저장됩니다. 원본 사이트를 새로 수집하지 않습니다.',
    'aria-label': `${title} 검토 상태 변경, Cloud 발견함 기록 저장`,
  },
  rightsSelectProps: {
    title: '권리 상태 표시 변경 - Cloud 발견함 기록에 저장됩니다. 사용 허가나 권리 확인 완료를 의미하지 않습니다.',
    'aria-label': `${title} 권리 상태 표시 변경, Cloud 발견함 기록 저장, 사용 허가 의미 아님`,
  },
});

export const getDiscoveryLinkActionsNoticeViewProps = () => ({
  message: '검토 상태와 권리 상태 표시는 바꾸는 즉시 Cloud 발견함에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다.',
});

export const getDiscoveryLinkSourceBadgeLabel = (sourceHost) => `출처 ${sourceHost}`;

export const getDiscoveryLinkUpdatedAtViewProps = ({ formattedDate } = {}) => ({
  message: `마지막 저장: ${formattedDate || '기록 없음'}`,
  fallbackText: '기록 없음',
});
