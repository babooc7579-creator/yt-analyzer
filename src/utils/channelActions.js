import { CHANNEL_STATUS } from '../constants/status';

export const appendChannel = (channels, channel) => [...channels, channel];

export const replaceChannel = (channels, nextChannel) => (
  channels.map(channel => (channel.id === nextChannel.id ? nextChannel : channel))
);

export const removeChannelById = (channels, channelId) => (
  channels.filter(channel => channel.id !== channelId)
);

export const removeSelectedChannelId = (channelIds, channelId) => (
  channelIds.filter(id => id !== channelId)
);

export const shouldDeselectChannelAfterUpdate = (updates = {}) => (
  updates.status && updates.status !== CHANNEL_STATUS.ACTIVE
);

export const getChannelDeleteName = (title) => title || '이 채널';

export const getChannelCloudActionError = (message, fallbackMessage, actionLabel = '저장') => {
  const baseMessage = message || fallbackMessage;
  if (baseMessage.includes('완료 처리하지 않았습니다')) return baseMessage;
  return `${baseMessage} Cloud 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getChannelDeleteConfirmMessage = (title) => {
  const channelName = getChannelDeleteName(title);
  return `'${channelName}' 채널을 Cloud 채널 목록에서 삭제할까요?\n\n삭제하면 저장 영상 조회와 새 영상 수집 대상에서 빠집니다. 나중에 다시 보려면 채널을 다시 추가해야 합니다.`;
};
