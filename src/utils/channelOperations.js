export const CHANNEL_OPERATION_STAGES = [
  {
    id: 'manage',
    step: '1',
    label: '채널 관리',
    description: '채널을 선택하고 등급·상태·태그를 관리합니다.',
    targetId: 'channel-operations-manage',
  },
  {
    id: 'add',
    step: '2',
    label: '새 채널 등록',
    description: 'YouTube 채널을 확인한 뒤 Cloud 목록에 저장합니다.',
    targetId: 'channel-operations-add',
  },
  {
    id: 'scan',
    step: '3',
    label: '새 영상 수집',
    description: '선택한 운영중 채널만 YouTube API로 확인합니다.',
    targetId: 'channel-operations-scan',
  },
];

export const getChannelOperationStage = (stageId) => (
  CHANNEL_OPERATION_STAGES.find((stage) => stage.id === stageId)
  || CHANNEL_OPERATION_STAGES[0]
);
