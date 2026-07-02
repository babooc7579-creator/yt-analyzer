import { isChannelScannable } from '../constants/status';
import { getDaysDiff } from './dates';
import { mapCloudVideoToViewModel } from './video';

export const mapStoredVideosToViewModels = (videos = []) => (
  videos.map((video) => mapCloudVideoToViewModel(video, getDaysDiff(video.uploadDate)))
);

export const getStoredVideosLoadedMessage = (videoCount) => (
  videoCount === 0
    ? '아직 저장된 영상이 없습니다. 새 데이터가 필요하면 "유튜브 새 영상 수집"을 실행해 주세요.'
    : `불러오기 완료! 총 ${videoCount}개의 영상을 가져왔습니다.`
);

export const getSelectedScannableChannelIds = (channels = [], selectedChannelIds = []) => (
  channels
    .filter(channel => selectedChannelIds.includes(channel.id) && isChannelScannable(channel))
    .map(channel => channel.id)
);

export const getScanRequestContext = ({ tag, selectedChannelIds = [], savedChannels = [] }) => {
  const scanSelectedChannels = !tag && selectedChannelIds.length > 0;
  const channelIdsForScan = scanSelectedChannels
    ? getSelectedScannableChannelIds(savedChannels, selectedChannelIds)
    : [];

  return {
    scanSelectedChannels,
    channelIdsForScan,
    scanningTag: scanSelectedChannels ? 'SELECTED' : (tag || 'ALL'),
  };
};

export const getScanStartMessage = ({ scanSelectedChannels, channelIdsForScan, tag }) => {
  const targetLabel = scanSelectedChannels
    ? `선택 채널 ${channelIdsForScan.length}개`
    : tag
      ? `'${tag}' 태그 채널`
      : '전체 채널';

  return `${targetLabel} 새 영상 수집 중... (YouTube API 호출이 발생합니다)`;
};

export const summarizeScanResults = (results = []) => (
  results.reduce((summary, result) => ({
    totalNew: summary.totalNew + (result.newVideosFound || 0),
    ttoTtoCount: summary.ttoTtoCount + (result.ttoTtoCandidates?.length || 0),
  }), { totalNew: 0, ttoTtoCount: 0 })
);

export const getScanCompleteMessage = (results = []) => {
  const { totalNew, ttoTtoCount } = summarizeScanResults(results);
  return `새 영상 수집 완료! 신규 영상 ${totalNew}개 발견${ttoTtoCount > 0 ? `, 터또터 후보 ${ttoTtoCount}개 발견!` : ''}`;
};
