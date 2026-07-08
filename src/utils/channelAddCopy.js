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
  previewButtonTitle: 'YouTube에서 채널 정보만 확인합니다. Cloud 저장과 영상 수집은 하지 않습니다.',
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
  label: bulkLoading ? 'YouTube 확인 후 Cloud 저장 중' : 'YouTube 확인 후 일괄 저장',
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
