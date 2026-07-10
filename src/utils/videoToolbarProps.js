import { hasCopyableUrlValue } from './copyUrlButtonProps';

export const getVideoToolbarScanActionViewProps = ({
  isScanning,
  scanTargetCount,
  selectedChannelCount,
}) => {
  const hasScanTargets = scanTargetCount > 0;
  const isScanDisabled = isScanning || !hasScanTargets;
  const scanButtonLabel = isScanning
    ? '새 영상 수집 중...'
    : selectedChannelCount > 0
      ? `선택 채널 새 영상 수집 (${scanTargetCount}/${selectedChannelCount}개)`
      : `전체 운영중 채널 새 영상 수집 (${scanTargetCount}개)`;
  const scanTitle = hasScanTargets
    ? 'YouTube API로 운영중 채널의 새 영상 여부를 확인합니다. 저장된 영상 불러오기와 다른 작업입니다.'
    : '새 영상 수집을 실행할 운영중 채널이 없습니다. 채널 상태를 운영중으로 바꾸거나 채널을 먼저 저장해 주세요.';
  const scanDescription = hasScanTargets
    ? selectedChannelCount > 0
      ? '체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다. 보류/제외 채널은 수집하지 않습니다.'
      : '선택한 채널이 없으면 전체 운영중 채널만 YouTube API로 확인합니다. 필요한 채널만 수집하려면 먼저 채널을 체크하세요.'
    : '운영중 채널이 0개라 새 영상 수집을 실행하지 않습니다. 저장 영상 불러오기는 별도의 DB 조회 작업입니다.';

  return {
    hasScanTargets,
    isScanDisabled,
    scanAriaLabel: hasScanTargets
      ? '선택 범위 새 영상 수집, YouTube API 호출'
      : '새 영상 수집 불가, 운영중 채널 없음',
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
  copyButtonAriaLabel: `현재 표시된 저장 영상 ${filteredCount}개 URL 목록 복사`,
  copyButtonCopiedLabel: '목록 복사 완료',
  copyButtonDisabled: !hasCopyableUrlValue(filteredVideoUrlList),
  copyButtonLabel: '영상 URL 목록 복사',
  copyButtonTitle: '현재 검색/필터/정렬 조건으로 보이는 영상 제목과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
  description: '검색, 필터, 정렬, 보기 방식은 현재 불러온 저장 영상의 화면 표시 조건만 바꿉니다. YouTube API를 새로 호출하지 않습니다.',
  statusText: `현재 표시 ${filteredCount}개 / 전체 ${totalCount}개`,
  title: '보관함 도구막대',
});

export const getVideoToolbarTtoTtoButtonViewProps = ({ ttoTtoMode }) => ({
  ariaLabel: ttoTtoMode
    ? '터또터 발굴 모드 끄기, 화면 필터만 변경하며 YouTube API 호출 없음'
    : '터또터 발굴 모드 켜기, 현재 불러온 저장 영상 필터링, YouTube API 호출 없음',
  label: '터또터 발굴 (6개월+)',
  title: ttoTtoMode
    ? '터또터 필터를 끕니다. 화면 표시 조건만 바꾸며 YouTube API를 새로 호출하지 않습니다.'
    : '현재 불러온 저장 영상에서 6개월 이상 지난 또터또 후보 중심으로 봅니다. 화면 필터만 바꾸며 YouTube API를 새로 호출하지 않습니다.',
});

export const getVideoToolbarViewProps = ({
  activeSelectedChannelCount,
  filteredCount,
  filteredVideoUrlList,
  handleManualScan,
  isScanning,
  lengthFilter,
  scannableChannelCount,
  searchKeyword,
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
    : scannableChannelCount;

  return {
    filtersProps: {
      lengthFilter,
      searchKeyword,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setViewFilter,
      setViewMode,
      showWorkPanel,
      sortType,
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
