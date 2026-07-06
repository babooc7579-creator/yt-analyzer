import { CHANNEL_STATUS } from '../constants/status';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toChannelObject = (channel) => (
  channel && typeof channel === 'object' ? channel : {}
);

const getChannelId = (channel) => toChannelObject(channel).id;

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
  return `${baseMessage} Cloud 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelDeleteConfirmMessage = (title) => {
  const channelName = getChannelDeleteName(title);
  return `'${channelName}' 채널을 Cloud 채널 목록에서 삭제할까요?\n\n삭제하면 저장 영상 조회와 새 영상 수집 대상에서 빠집니다. YouTube 원본이나 이미 Cloud에 저장된 영상 데이터는 삭제하지 않습니다. 나중에 다시 보려면 채널을 다시 추가해야 합니다.`;
};
