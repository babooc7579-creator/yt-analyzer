const toArray = (items) => (Array.isArray(items) ? items : []);

const toText = (value) => (typeof value === 'string' ? value : '');

const toChannelObject = (channel) => (
  channel && typeof channel === 'object' ? channel : {}
);

export const CHANNEL_PREVIEW_LOAD_FAILED_MESSAGE =
  '채널을 불러오지 못했습니다.';

export const CHANNEL_PREVIEW_DUPLICATE_MESSAGE =
  '이미 등록된 채널입니다.';

export const BULK_CHANNEL_EMPTY_INPUT_MESSAGE =
  '등록할 채널을 한 줄에 하나씩 입력해 주세요.';

export const CHANNEL_SAVE_ACTION_LABEL = '저장';

export const BULK_CHANNEL_SAVE_ACTION_LABEL = '일괄 저장';

export const getTrimmedChannelInput = (input = '') => toText(input).trim();

export const getBulkChannelHandles = (bulkInput = '') => (
  toText(bulkInput)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
);

export const isDuplicateChannel = (channels = [], channelId) => (
  toArray(channels).some(channel => toChannelObject(channel).id === channelId)
);

export const getChannelCreatePayload = ({
  handle,
  language,
  note,
  tags,
}) => ({
  handle: getTrimmedChannelInput(handle),
  tags: toArray(tags),
  language,
  note,
});

export const getBulkChannelCreatePayload = ({
  handles,
  language,
  tags,
}) => ({
  handles: toArray(handles),
  tags: toArray(tags),
  language,
});

export const getChannelSaveFailureMessage = (error, actionLabel = '저장') => {
  const message = error?.message || '채널 정보를 Cloud에 저장하지 못했습니다.';
  if (message.includes('완료 처리하지 않았습니다')) return message;
  return `${message} Cloud 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelSaveStartMessage = () => (
  '채널을 Cloud 목록에 저장하는 중입니다. 새 영상 수집은 실행하지 않습니다.'
);

export const getChannelSaveCompleteMessage = () => (
  '채널이 Cloud 목록에 추가되었습니다. 새 영상은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 확인합니다.'
);

export const getBulkChannelSaveStartMessage = (channelCount) => (
  `${channelCount}개 채널 정보를 YouTube에서 확인한 뒤 Cloud 목록에 저장하는 중입니다. 영상 수집은 실행하지 않습니다.`
);

export const getBulkChannelSaveCompleteMessage = ({ total, added }) => (
  `Cloud 일괄 추가 완료: ${total}개 중 ${added}개가 저장되었습니다. 새 영상 수집은 실행하지 않았습니다.`
);
