export const getTrimmedChannelInput = (input = '') => input.trim();

export const getBulkChannelHandles = (bulkInput = '') => (
  bulkInput
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
);

export const isDuplicateChannel = (channels = [], channelId) => (
  channels.some(channel => channel.id === channelId)
);

export const getChannelCreatePayload = ({
  handle,
  language,
  note,
  tags,
}) => ({
  handle: getTrimmedChannelInput(handle),
  tags,
  language,
  note,
});

export const getBulkChannelCreatePayload = ({
  handles,
  language,
  tags,
}) => ({
  handles,
  tags,
  language,
});
