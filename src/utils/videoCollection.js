import { isChannelScannable } from '../constants/status';
import { getDaysDiff } from './dates';
import { mapCloudVideoToViewModel } from './video';

export const mapStoredVideosToViewModels = (videos = []) => (
  videos.map((video) => mapCloudVideoToViewModel(video, getDaysDiff(video.uploadDate)))
);

export const getStoredVideosLoadedMessage = (videoCount) => (
  videoCount === 0
    ? 'Cloud DB에는 아직 저장된 영상이 없습니다. 새 데이터가 필요할 때만 "선택 채널 새 영상 수집"을 실행해 주세요.'
    : `Cloud DB 조회 완료: 저장된 영상 ${videoCount}개를 불러왔습니다. 새 YouTube API 호출은 없었습니다.`
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

  return `${targetLabel} 새 영상 수집 중입니다. YouTube API 호출이 발생하며 저장 영상 불러오기와 다른 작업입니다.`;
};

export const summarizeScanResults = (results = []) => (
  results.reduce((summary, result) => ({
    totalNew: summary.totalNew + (result.newVideosFound || 0),
    ttoTtoCount: summary.ttoTtoCount + (result.ttoTtoCandidates?.length || 0),
  }), { totalNew: 0, ttoTtoCount: 0 })
);

export const getScanCompleteMessage = (results = []) => {
  const { totalNew, ttoTtoCount } = summarizeScanResults(results);
  return `새 영상 수집 완료: 신규 영상 ${totalNew}개 확인${ttoTtoCount > 0 ? `, 터또터 후보 ${ttoTtoCount}개 확인` : ''}. 이후 저장 영상 불러오기는 Cloud DB 조회입니다.`;
};
