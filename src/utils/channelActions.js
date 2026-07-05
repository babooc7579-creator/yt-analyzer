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
