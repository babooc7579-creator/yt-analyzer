export const CHANNEL_INPUT_PLACEHOLDER = '핸들 / 채널링크 / 영상링크';

export const CHANNEL_BULK_INPUT_PLACEHOLDER = [
  '핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요',
  '',
  '@channel1',
  'https://youtube.com/@channel2',
  'https://youtu.be/xxxxxxxxxxx',
].join('\n');

export const getChannelPreviewInputCopy = () => ({
  inputPlaceholder: CHANNEL_INPUT_PLACEHOLDER,
  inputAriaLabel: '확인할 채널 핸들, 채널 링크 또는 영상 링크',
  inputTitle: '붙여넣기만으로는 온라인 저장소(Azure DB) 저장이나 영상 수집이 실행되지 않습니다. YouTube에서 확인 버튼으로 채널 정보만 먼저 확인합니다.',
  previewButtonTitle: 'YouTube에서 채널 정보만 확인합니다. 온라인 저장소(Azure DB) 저장과 영상 수집은 하지 않습니다.',
  previewButtonAriaLabel: 'YouTube에서 채널 정보 확인',
  previewButtonLabel: 'YouTube에서 확인',
  helperText: '아직 Cloud에 저장하지 않고 YouTube에서 채널 정보만 먼저 확인합니다. 영상 수집은 하지 않습니다.',
});

export const getChannelBulkInputCopy = (recognizedLineCount = 0) => ({
  placeholder: CHANNEL_BULK_INPUT_PLACEHOLDER,
  ariaLabel: '일괄 추가할 채널 목록',
  helperText: `${recognizedLineCount}개 줄 인식됨. YouTube에서 채널 정보만 확인한 뒤 Cloud 목록에 저장합니다. 영상 수집은 하지 않습니다.`,
});

export const getChannelBulkSubmitButtonCopy = ({ bulkLoading = false } = {}) => ({
  title: 'YouTube에서 채널 정보를 확인한 뒤 Cloud 채널 목록에 저장합니다. 영상 수집은 하지 않습니다.',
  ariaLabel: 'YouTube 확인 후 채널 일괄 저장',
  label: bulkLoading ? 'YouTube 확인 후 온라인 저장소(Azure DB) 저장 중' : 'YouTube 확인 후 일괄 저장',
});

export const getChannelPreviewActionsCopy = () => ({
  cancelButtonTitle: '채널 저장을 취소하고 입력 화면으로 돌아가기',
  cancelButtonAriaLabel: '채널 저장 취소',
  cancelButtonLabel: '취소',
  saveButtonTitle: '채널을 Cloud 목록에 저장합니다. 새 영상 수집은 하지 않습니다.',
  saveButtonAriaLabel: '채널을 Cloud 목록에 저장',
  saveButtonLabel: '채널 저장',
});

export const getChannelPreviewSaveNoticeText = () => (
  '채널을 Cloud 목록에 저장합니다. 새 영상 수집은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 진행됩니다.'
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
    title: '화면 카테고리와 Cloud 태그 이름을 관리',
  },
});

export const getChannelBulkResultPanelViewProps = (bulkResult = {}) => {
  const resultSummary = bulkResult && typeof bulkResult === 'object' ? bulkResult : {};
  const results = Array.isArray(resultSummary.results) ? resultSummary.results : [];
  const failedResults = results.filter(result => !result.success);
  const failedResultMessages = failedResults.map(result => (
    `실패: ${result.handle} - ${result.error}`
  ));

  return {
    closeButtonProps: {
      'aria-label': '채널 일괄 저장 결과 닫기',
      label: '닫기',
      title: '일괄 저장 결과 닫기',
    },
    failedResultMessages,
    failedResults,
    summaryText: `총 ${resultSummary.total || 0}개 중 ${resultSummary.added || 0}개 성공`,
  };
};
