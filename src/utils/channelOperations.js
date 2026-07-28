import { isChannelScannable } from '../constants/status';
import {
  getLoadedVideoCountForSelectedChannels,
  hasEmptyStoredVideoLoad,
} from './homeRadarJourney';

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
    description: 'YouTube 채널을 확인한 뒤 온라인 저장소(Azure DB)에 저장합니다.',
    targetId: 'channel-operations-add',
  },
  {
    id: 'scan',
    step: '3',
    label: '수집 영상 확인·새 영상 수집',
    description: '수집 영상을 먼저 보고, 필요할 때만 YouTube API로 새 영상을 확인합니다.',
    targetId: 'channel-operations-scan',
  },
];

export const getChannelOperationStage = (stageId) => (
  CHANNEL_OPERATION_STAGES.find((stage) => stage.id === stageId)
  || CHANNEL_OPERATION_STAGES[0]
);

const toArray = (items) => (Array.isArray(items) ? items : []);

const getChannelId = (channel = {}) => channel.id || channel.channelId || '';

const hasScanRecord = (channel = {}) => Boolean(
  channel.lastScanSummary?.scannedAt || channel.lastScannedAt,
);

export const getChannelOperationsJourney = ({
  isLoading = false,
  isScanning = false,
  savedChannels = [],
  selectedChannelIds = [],
  storedVideoLoadResult,
  videos = [],
} = {}) => {
  const channelList = toArray(savedChannels);
  const selectedChannels = toArray(selectedChannelIds);
  const savedChannelCount = channelList.length;
  const selectedChannelCount = selectedChannels.length;
  const selectedIdSet = new Set(selectedChannels);
  const selectedScannableChannels = channelList.filter((channel) => (
    selectedIdSet.has(getChannelId(channel)) && isChannelScannable(channel)
  ));
  const selectedScannableChannelCount = selectedScannableChannels.length;
  const selectedScannedChannelCount = selectedScannableChannels.filter(hasScanRecord).length;
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
      : selectedChannelCount === 0
        ? { label: '채널 선택 필요', tone: 'waiting' }
        : selectedScannableChannelCount === 0
          ? { label: '운영중 채널 필요', tone: 'waiting' }
          : selectedScannedChannelCount === selectedScannableChannelCount
            ? { label: `${selectedScannedChannelCount}개 수집 기록`, tone: 'complete' }
            : selectedScannedChannelCount > 0
              ? { label: `${selectedScannedChannelCount}/${selectedScannableChannelCount}개 기록`, tone: 'ready' }
              : { label: `${selectedScannableChannelCount}개 수집 가능`, tone: 'ready' },
  };

  if (savedChannelCount === 0) {
    return {
      description: '채널을 등록해도 새 영상 수집은 자동으로 실행되지 않습니다.',
      primaryAction: {
        id: 'open-add',
        label: '새 채널 등록하기',
        title: '새 채널 등록 영역으로 이동합니다. 이동만으로 YouTube API 호출이나 온라인 저장소(Azure DB) 저장은 실행되지 않습니다.',
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
      description: 'YouTube API로 새 영상 여부를 확인 중입니다. 완료되면 수집 영상도 자동으로 다시 불러옵니다.',
      primaryAction: null,
      stageStatusById,
      title: `선택 채널 ${selectedChannelCount}개를 수집 중입니다`,
    };
  }

  if (videoCount === 0 && hasEmptyStoredVideoLoad(storedVideoLoadResult)) {
    if (selectedScannableChannelCount === 0) {
      return {
        description: '온라인 저장소(Azure DB) 조회 결과 수집된 영상 정보가 없고, 현재 선택은 보류·제외 채널이라 새 영상 수집 대상도 아닙니다.',
        primaryAction: {
          id: 'open-manage',
          label: '운영중 채널 다시 선택',
          title: '채널 목록으로 이동합니다. 채널 선택만으로 YouTube API 호출이나 데이터 저장은 실행되지 않습니다.',
        },
        stageStatusById,
        title: '새 영상을 수집할 운영중 채널이 필요합니다',
      };
    }

    return {
      description: '온라인 저장소(Azure DB) 조회 결과 선택 채널에 수집된 영상 정보가 없습니다. 다른 채널을 고르거나 새 영상 수집 단계로 이동하세요.',
      primaryAction: {
        id: 'open-scan',
        label: '새 영상 수집 단계',
        title: '새 영상 수집 영역으로 이동만 합니다. 실제 수집 버튼을 누를 때만 YouTube API를 호출할 수 있습니다.',
      },
      secondaryAction: {
        id: 'open-manage',
        label: '채널 다시 선택',
        title: '채널 목록으로 이동합니다. 채널 선택만으로 YouTube API 호출이나 데이터 저장은 실행되지 않습니다.',
      },
      stageStatusById,
      title: '선택 채널에 수집된 영상 정보가 없습니다',
    };
  }

  if (videoCount > 0) {
    return {
      description: '현재 불러온 수집 영상 정보를 보거나 오늘의 레이더에서 후보를 판단할 수 있습니다.',
      primaryAction: {
        id: 'open-videos',
        label: `수집 영상 ${videoCount}개 보기`,
        title: '현재 불러온 수집 영상 목록 화면으로 이동합니다. YouTube API를 새로 호출하지 않습니다.',
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
    description: selectedScannableChannelCount > 0
      ? '온라인 저장소(Azure DB)에 있는 기존 수집 영상 정보를 먼저 조회할 수 있습니다. 새 데이터가 필요할 때만 YouTube API 수집을 실행하세요.'
      : '온라인 저장소(Azure DB)에 있는 기존 수집 영상 정보는 조회할 수 있지만, 현재 선택은 보류·제외 채널이라 새 영상 수집 대상은 아닙니다.',
    primaryAction: {
      disabled: isLoading,
      id: 'load-stored',
      label: isLoading ? '수집 영상 불러오는 중...' : '수집 영상 목록 불러오기',
      title: '선택 채널의 기존 영상을 온라인 저장소(Azure DB)에서 조회합니다. YouTube API를 새로 호출하지 않습니다.',
    },
    secondaryAction: selectedScannableChannelCount > 0
      ? {
          id: 'open-scan',
          label: '새 영상 수집 단계',
          title: '새 영상 수집 영역으로 이동만 합니다. 실제 수집 버튼을 누를 때만 YouTube API를 호출할 수 있습니다.',
        }
      : {
          id: 'open-manage',
          label: '운영중 채널 선택',
          title: '채널 목록으로 이동합니다. 채널 선택만으로 YouTube API 호출이나 데이터 저장은 실행되지 않습니다.',
        },
    stageStatusById,
    title: `채널 ${selectedChannelCount}개 선택 완료`,
  };
};
