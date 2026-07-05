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
