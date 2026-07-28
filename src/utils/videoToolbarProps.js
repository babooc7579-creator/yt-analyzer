import { hasCopyableUrlValue } from './copyUrlButtonProps';

export const getVideoToolbarScanActionViewProps = ({
  isScanning,
  scanTargetCount,
  selectedChannelCount,
}) => {
  const hasSelectedChannels = selectedChannelCount > 0;
  const hasScanTargets = hasSelectedChannels && scanTargetCount > 0;
  const isScanDisabled = isScanning || !hasScanTargets;
  const scanButtonLabel = isScanning
    ? '새 영상 수집 중...'
    : hasSelectedChannels
      ? `선택 채널 새 영상 수집 (${scanTargetCount}/${selectedChannelCount}개)`
      : '채널 선택 후 새 영상 수집';
  const scanTitle = hasScanTargets
    ? 'YouTube API로 운영중 채널의 새 영상 여부를 확인합니다. 수집 영상 목록 불러오기와 다른 작업입니다.'
    : hasSelectedChannels
      ? '선택한 채널 중 운영중 채널이 없습니다. 채널 상태를 운영중으로 바꾼 뒤 다시 확인해 주세요.'
      : 'YouTube API로 새 영상을 수집하려면 오늘 확인할 채널을 먼저 선택해 주세요.';
  const scanDescription = hasScanTargets
    ? '체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다. 보류/제외 채널은 수집하지 않습니다.'
    : hasSelectedChannels
      ? '선택한 채널에 운영중 채널이 없어 새 영상 수집을 실행하지 않습니다. 수집 영상 목록 불러오기는 별도의 DB 조회 작업입니다.'
      : '실수로 전체 채널을 수집하지 않도록 채널을 하나 이상 선택해야 합니다. 선택만으로 YouTube API는 호출되지 않습니다.';

  return {
    hasScanTargets,
    isScanDisabled,
    scanAriaLabel: hasScanTargets
      ? '선택 범위 새 영상 수집, YouTube API 호출'
      : hasSelectedChannels
        ? '새 영상 수집 불가, 선택한 운영중 채널 없음'
        : '새 영상 수집 불가, 채널 선택 필요',
    scanButtonLabel,
    scanDescription,
    scanTitle,
  };
};

export const getVideoToolbarReferenceHeaderViewProps = ({
  filteredCount,
  filteredVideoUrlList,
  totalCount,
}) => ({
  copyButtonAriaLabel: `현재 표시된 수집 영상 ${filteredCount}개 URL 목록 복사`,
  copyButtonCopiedLabel: '목록 복사 완료',
  copyButtonDisabled: !hasCopyableUrlValue(filteredVideoUrlList),
  copyButtonLabel: '영상 URL 목록 복사',
  copyButtonTitle: '현재 검색/필터/정렬 조건으로 보이는 영상 제목과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
  description: '검색, 필터, 정렬, 보기 방식은 현재 불러온 수집 영상 정보의 화면 표시 조건만 바꿉니다. YouTube API를 새로 호출하지 않습니다.',
  statusText: `현재 표시 ${filteredCount}개 / 전체 ${totalCount}개`,
  title: '보관함 도구막대',
});

export const getVideoToolbarTtoTtoButtonViewProps = ({ ttoTtoMode }) => ({
  ariaLabel: ttoTtoMode
    ? '또터또 발굴 모드 끄기, 화면 필터만 변경하며 YouTube API 호출 없음'
    : '또터또 발굴 모드 켜기, 현재 불러온 수집 영상 정보 필터링, YouTube API 호출 없음',
  label: '또터또 발굴 (6개월+ · 1.5배+)',
  title: ttoTtoMode
    ? '또터또 필터를 끕니다. 화면 표시 조건만 바꾸며 YouTube API를 새로 호출하지 않습니다.'
    : '현재 불러온 수집 영상 정보에서 6개월 이상 지났고 채널 평균보다 1.5배 이상 반응한 또터또 후보만 봅니다. 화면 필터만 바꾸며 YouTube API를 새로 호출하지 않습니다.',
});

export const getVideoToolbarViewProps = ({
  activeSelectedChannelCount,
  filteredCount,
  filteredVideoUrlList,
  handleManualScan,
  isScanning,
  lengthFilter,
  onResetFilters,
  searchKeyword,
  selectedVideoCount,
  selectedChannelCount,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setTtoTtoMode,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  totalCount,
  ttoTtoMode,
  viewFilter,
  viewMode,
}) => {
  const scanTargetCount = selectedChannelCount > 0
    ? activeSelectedChannelCount
    : 0;

  return {
    filtersProps: {
      lengthFilter,
      onResetFilters,
      searchKeyword,
      selectedVideoCount,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setViewFilter,
      setViewMode,
      showWorkPanel,
      sortType,
      ttoTtoMode,
      viewFilter,
      viewMode,
    },
    referenceHeaderProps: {
      filteredCount,
      filteredVideoUrlList,
      totalCount,
    },
    scanActionProps: {
      handleManualScan,
      isScanning,
      scanTargetCount,
      selectedChannelCount,
    },
    ttoTtoButtonProps: {
      setTtoTtoMode,
      ttoTtoMode,
    },
  };
};
