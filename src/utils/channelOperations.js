import { getLoadedVideoCountForSelectedChannels } from './homeRadarJourney';

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

const toArray = (items) => (Array.isArray(items) ? items : []);

const hasScanRecord = (channel = {}) => Boolean(
  channel.lastScanSummary?.scannedAt || channel.lastScannedAt,
);

export const getChannelOperationsJourney = ({
  isLoading = false,
  isScanning = false,
  savedChannels = [],
  selectedChannelIds = [],
  videos = [],
} = {}) => {
  const channelList = toArray(savedChannels);
  const selectedChannels = toArray(selectedChannelIds);
  const savedChannelCount = channelList.length;
  const selectedChannelCount = selectedChannels.length;
  const scannedChannelCount = channelList.filter(hasScanRecord).length;
  const videoCount = getLoadedVideoCountForSelectedChannels({
    savedChannels: channelList,
    selectedChannelIds: selectedChannels,
    videos,
  });

  const stageStatusById = {
    manage: selectedChannelCount > 0
      ? { label: `${selectedChannelCount}개 선택`, tone: 'complete' }
      : savedChannelCount > 0
        ? { label: `${savedChannelCount}개 등록`, tone: 'ready' }
        : { label: '채널 없음', tone: 'waiting' },
    add: savedChannelCount > 0
      ? { label: `${savedChannelCount}개 등록됨`, tone: 'complete' }
      : { label: '첫 채널 필요', tone: 'ready' },
    scan: isScanning
      ? { label: '수집 중', tone: 'active' }
      : scannedChannelCount > 0
        ? { label: `${scannedChannelCount}개 수집 기록`, tone: 'complete' }
        : selectedChannelCount > 0
          ? { label: `${selectedChannelCount}개 수집 가능`, tone: 'ready' }
          : { label: '채널 선택 필요', tone: 'waiting' },
  };

  if (savedChannelCount === 0) {
    return {
      description: '채널을 등록해도 새 영상 수집은 자동으로 실행되지 않습니다.',
      primaryAction: {
        id: 'open-add',
        label: '새 채널 등록하기',
        title: '새 채널 등록 영역으로 이동합니다. 이동만으로 YouTube API 호출이나 Cloud 저장은 실행되지 않습니다.',
      },
      stageStatusById,
      title: '먼저 소재를 모을 채널을 등록하세요',
    };
  }

  if (selectedChannelCount === 0) {
    return {
      description: `등록 채널 ${savedChannelCount}개 중 오늘 확인할 채널을 체크하세요. 선택만으로 API는 호출되지 않습니다.`,
      primaryAction: {
        id: 'open-manage',
        label: '채널 선택하기',
        title: '채널 목록으로 이동합니다. 채널 선택만으로 YouTube API 호출이나 데이터 저장은 실행되지 않습니다.',
      },
      stageStatusById,
      title: '오늘 확인할 채널을 고르세요',
    };
  }

  if (isScanning) {
    return {
      description: 'YouTube API로 새 영상 여부를 확인 중입니다. 완료되면 저장 영상도 자동으로 다시 불러옵니다.',
      primaryAction: null,
      stageStatusById,
      title: `선택 채널 ${selectedChannelCount}개를 수집 중입니다`,
    };
  }

  if (videoCount > 0) {
    return {
      description: '현재 불러온 저장 영상을 보거나 오늘의 레이더에서 후보를 판단할 수 있습니다.',
      primaryAction: {
        id: 'open-videos',
        label: `저장 영상 ${videoCount}개 보기`,
        title: '현재 불러온 저장 영상 화면으로 이동합니다. YouTube API를 새로 호출하지 않습니다.',
      },
      secondaryAction: {
        id: 'open-radar',
        label: '오늘의 레이더로',
        title: '오늘의 레이더로 이동합니다. 이동만으로 API 호출이나 데이터 변경은 실행되지 않습니다.',
      },
      stageStatusById,
      title: '영상이 준비됐습니다',
    };
  }

  return {
    description: '기존 Cloud 영상을 먼저 조회할 수 있습니다. 새 데이터가 필요할 때만 YouTube API 수집을 실행하세요.',
    primaryAction: {
      disabled: isLoading,
      id: 'load-stored',
      label: isLoading ? '저장 영상 불러오는 중...' : '저장 영상 불러오기',
      title: '선택 채널의 기존 영상을 Cloud DB에서 조회합니다. YouTube API를 새로 호출하지 않습니다.',
    },
    secondaryAction: {
      id: 'open-scan',
      label: '새 영상 수집 단계',
      title: '새 영상 수집 영역으로 이동만 합니다. 실제 수집 버튼을 누를 때만 YouTube API를 호출할 수 있습니다.',
    },
    stageStatusById,
    title: `채널 ${selectedChannelCount}개 선택 완료`,
  };
};
