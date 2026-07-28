import { CHANNEL_STATUS } from '../constants/status';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toChannelObject = (channel) => (
  channel && typeof channel === 'object' ? channel : {}
);

const getChannelId = (channel) => toChannelObject(channel).id;

export const CHANNEL_ACTION_COPY = Object.freeze({
  add: {
    failureMessage: '채널 추가에 실패했습니다.',
    actionLabel: '저장',
  },
  bulkAdd: {
    failureMessage: '일괄 추가에 실패했습니다.',
    actionLabel: '일괄 저장',
  },
  delete: {
    failureMessage: '채널 삭제에 실패했습니다.',
    actionLabel: '삭제',
  },
  metadata: {
    failureMessage: '채널 정보를 저장하지 못했습니다.',
    actionLabel: '정보 저장',
  },
  note: {
    failureMessage: '기록 저장에 실패했습니다.',
    actionLabel: '메모 저장',
  },
});

export const CHANNEL_LOAD_FAILED_MESSAGE =
  '채널 목록을 불러오지 못했습니다.';

export const appendChannel = (channels, channel) => {
  const nextChannel = toChannelObject(channel);
  if (!getChannelId(nextChannel)) return toArray(channels);
  return [...toArray(channels), nextChannel];
};

export const replaceChannel = (channels, nextChannel) => {
  const channel = toChannelObject(nextChannel);
  const channelId = getChannelId(channel);
  if (!channelId) return toArray(channels);

  return toArray(channels).map(currentChannel => (
    getChannelId(currentChannel) === channelId ? channel : currentChannel
  ));
};

export const removeChannelById = (channels, channelId) => (
  toArray(channels).filter(channel => getChannelId(channel) !== channelId)
);

export const removeSelectedChannelId = (channelIds, channelId) => (
  toArray(channelIds).filter(id => id !== channelId)
);

export const shouldDeselectChannelAfterUpdate = (updates = {}) => {
  const updateValues = toChannelObject(updates);
  return updateValues.status && updateValues.status !== CHANNEL_STATUS.ACTIVE;
};

export const getChannelDeleteName = (title) => title || '이 채널';

export const getChannelCloudActionError = (message, fallbackMessage, actionLabel = '저장') => {
  const baseMessage = message || fallbackMessage;
  if (baseMessage.includes('완료 처리하지 않았습니다')) return baseMessage;
  return `${baseMessage} 온라인 저장소(Azure DB)의 채널 ${actionLabel} 작업을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelLoadErrorMessage = (error) => {
  const message = error?.message || CHANNEL_LOAD_FAILED_MESSAGE;
  return `${message} 온라인 저장소(Azure DB)의 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelDeleteConfirmMessage = (title) => {
  const channelName = getChannelDeleteName(title);
  return `'${channelName}' 채널을 온라인 저장소(Azure DB)의 채널 목록에서 삭제할까요?\n\n삭제하면 수집 영상 조회와 새 영상 수집 대상에서 빠집니다. YouTube 원본이나 이미 온라인 저장소(Azure DB)에 수집된 영상 정보는 삭제하지 않습니다. 나중에 다시 보려면 채널을 다시 추가해야 합니다.`;
};
