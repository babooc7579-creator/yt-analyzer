export const CHANNEL_INPUT_PLACEHOLDER = '핸들 / 채널링크 / 영상링크';

export const CHANNEL_BULK_INPUT_PLACEHOLDER = [
  '핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요',
  '',
  '@channel1',
  'https://youtube.com/@channel2',
  'https://youtu.be/xxxxxxxxxxx',
].join('\n');

export const getChannelPreviewInputCopy = ({ hasInput = true } = {}) => ({
  inputPlaceholder: CHANNEL_INPUT_PLACEHOLDER,
  inputAriaLabel: '확인할 채널 핸들, 채널 링크 또는 영상 링크',
  inputTitle: '붙여넣기만으로는 YouTube API 호출, 온라인 저장소(Azure DB) 저장, 영상 수집이 실행되지 않습니다. 확인 버튼을 눌러야 채널 정보를 조회합니다.',
  previewButtonTitle: hasInput
    ? 'YouTube API를 사용해 채널 정보만 확인합니다. 온라인 저장소(Azure DB) 저장과 영상 수집은 하지 않습니다.'
    : '채널 핸들, 채널 링크 또는 영상 링크를 먼저 입력해 주세요.',
  previewButtonAriaLabel: 'YouTube API로 채널 정보 확인',
  previewButtonLabel: 'YouTube API로 확인',
  helperText: hasInput
    ? '이 버튼은 YouTube API로 채널 정보만 확인합니다. 아직 온라인 저장소(Azure DB)에 저장하지 않고 영상 수집은 하지 않습니다.'
    : '채널 정보를 입력하면 YouTube에서 정보만 확인할 수 있습니다. 입력만으로 API 호출이나 저장은 실행되지 않습니다.',
});

export const getChannelBulkInputCopy = (recognizedLineCount = 0) => ({
  placeholder: CHANNEL_BULK_INPUT_PLACEHOLDER,
  ariaLabel: '일괄 추가할 채널 목록',
  helperText: `${recognizedLineCount}/50개 인식됨. 최대 50개를 10개씩 YouTube API로 확인해 온라인 저장소(Azure DB)에 등록합니다. 영상 수집은 하지 않습니다.`,
});

export const getChannelBulkSubmitButtonCopy = ({ bulkLoading = false } = {}) => ({
  title: 'YouTube API로 채널 정보를 확인한 뒤 온라인 저장소(Azure DB)의 채널 목록에 저장합니다. 영상 수집은 하지 않습니다.',
  ariaLabel: 'YouTube API 확인 후 채널 일괄 저장',
  label: bulkLoading ? 'YouTube API 확인 후 온라인 저장소(Azure DB) 저장 중' : 'YouTube API 확인 후 일괄 저장',
});

export const getChannelPreviewActionsCopy = () => ({
  cancelButtonTitle: '채널 저장을 취소하고 입력 화면으로 돌아가기',
  cancelButtonAriaLabel: '채널 저장 취소',
  cancelButtonLabel: '취소',
  saveButtonTitle: '채널을 온라인 저장소(Azure DB)에 저장합니다. 새 영상 수집은 하지 않습니다.',
  saveButtonAriaLabel: '채널을 온라인 저장소(Azure DB)에 저장',
  saveButtonLabel: '채널 저장',
});

export const getChannelPreviewSaveNoticeText = () => (
  '채널을 온라인 저장소(Azure DB)에 저장합니다. 새 영상 수집은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 진행됩니다.'
);

export const getChannelBulkTagSelectorLabel = () => (
  '태그 선택 (전체 일괄 적용, 여러 개 가능)'
);

export const getChannelPreviewTagSelectorLabel = () => (
  '태그 선택 (여러 개 가능, 안 골라도 OK)'
);

export const getChannelLanguageSelectCopy = () => ({
  ariaLabel: '채널 기본 언어 선택',
  title: '채널 기본 언어 선택',
});

export const getChannelPreviewNoteFieldCopy = () => ({
  ariaLabel: '새 채널 첫 기록 메모',
  placeholder: '첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함',
});

export const getChannelPreviewSummaryViewProps = () => ({
  closeButtonProps: {
    ariaLabel: '채널 확인 결과 닫기',
    title: '채널 확인 결과 닫기',
  },
  statusLabel: '채널 확인 완료',
});

export const getChannelAddFormHeaderCopy = () => ({
  label: '새 채널 모니터링 추가',
  modeButtons: [
    {
      ariaLabel: '단일 채널 추가 모드',
      label: '단일',
      mode: 'single',
      title: '채널을 하나씩 확인하고 추가',
    },
    {
      ariaLabel: '채널 일괄 추가 모드',
      label: '일괄',
      mode: 'bulk',
      title: '여러 채널을 한 번에 확인하고 추가',
    },
  ],
  categoryButtonProps: {
    ariaLabel: '카테고리 설정 열기',
    label: '카테고리 설정',
    title: '화면 카테고리와 온라인 저장소(Azure DB)의 채널 태그 이름을 관리',
  },
});

export const getChannelBulkResultPanelViewProps = (bulkResult = {}) => {
  const resultSummary = bulkResult && typeof bulkResult === 'object' ? bulkResult : {};
  const results = Array.isArray(resultSummary.results) ? resultSummary.results : [];
  const failedResults = results.filter(result => result.status === 'failed' || !result.success);
  const failedResultMessages = failedResults.map(result => (
    `실패: ${result.handle} - ${result.error}`
  ));
  const resultMessages = results.map((result, index) => {
    const status = result.status || (result.success ? 'added' : 'failed');
    const prefix = status === 'existing' ? '기존 등록' : status === 'duplicate' ? '중복 입력' : status === 'added' ? '새로 저장' : '실패';
    return {
      key: result.handle || String(index),
      status,
      text: status === 'failed'
        ? `${prefix}: ${result.handle} - ${result.error}`
        : `${prefix}: ${result.handle}`,
    };
  });

  return {
    closeButtonProps: {
      'aria-label': '채널 일괄 저장 결과 닫기',
      label: '닫기',
      title: '일괄 저장 결과 닫기',
    },
    failedResultMessages,
    failedResults,
    resultMessages,
    summaryText: `전체 ${resultSummary.total || 0}개 · 새로 저장 ${resultSummary.added || 0}개 · 기존 등록 ${resultSummary.existing || 0}개 · 중복 입력 ${resultSummary.duplicate || 0}개 · 실패 ${resultSummary.failed || failedResults.length}개`,
  };
};
