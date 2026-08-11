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

export const MAX_BULK_CHANNELS = 50;

export const BULK_CHANNEL_LIMIT_MESSAGE =
  `채널은 한 번에 최대 ${MAX_BULK_CHANNELS}개까지 등록할 수 있습니다.`;

export const CHANNEL_SAVE_ACTION_LABEL = '저장';

export const BULK_CHANNEL_SAVE_ACTION_LABEL = '일괄 저장';

export const getTrimmedChannelInput = (input = '') => toText(input).trim();

export const getBulkChannelHandles = (bulkInput = '') => (
  [...new Set(toText(bulkInput)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean))]
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
  const message = error?.message || '채널 정보를 온라인 저장소(Azure DB)에 저장하지 못했습니다.';
  if (message.includes('완료 처리하지 않았습니다')) return message;
  return `${message} 온라인 저장소(Azure DB)의 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelSaveStartMessage = () => (
  '채널을 온라인 저장소(Azure DB)에 저장하는 중입니다. 새 영상 수집은 실행하지 않습니다.'
);

export const getChannelSaveCompleteMessage = () => (
  '채널이 온라인 저장소(Azure DB)에 추가되었습니다. 새 영상은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 확인합니다.'
);

export const getBulkChannelSaveStartMessage = (channelCount) => (
  `${channelCount}개 채널 정보를 YouTube API로 확인한 뒤 온라인 저장소(Azure DB)에 저장하는 중입니다. 영상 수집은 실행하지 않습니다.`
);

export const getBulkChannelSaveCompleteMessage = ({ total, added, existing = 0, duplicate = 0, failed = 0 }) => (
  `채널 등록 처리 완료: 전체 ${total}개 · 새로 저장 ${added}개 · 기존 등록 ${existing}개 · 중복 입력 ${duplicate}개 · 실패 ${failed}개. 새 영상 수집은 실행하지 않았습니다.`
);
