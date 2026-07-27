import { isChannelScannable } from '../constants/status';
import { getDaysDiff } from './dates';
import { mapCloudVideoToViewModel } from './video';

export const mapStoredVideosToViewModels = (videos = []) => (
  videos.map((video) => mapCloudVideoToViewModel(video, getDaysDiff(video.uploadDate)))
);

export const STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE =
  '수집된 영상 정보를 불러올 채널을 하나 이상 선택해 주세요. 이 작업은 DB 조회이며 새 영상 수집은 실행하지 않습니다.';

export const STORED_VIDEO_LOAD_FAILED_MESSAGE =
  '온라인 저장소(Azure DB)에 보관된 수집 영상 정보를 불러오지 못했습니다.';

export const SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE =
  '운영중 상태의 채널을 하나 이상 선택해 주세요. 보류/제외 채널은 새 영상 수집에서 제외됩니다.';

export const SCAN_FAILED_MESSAGE =
  '스캔에 실패했습니다.';

const getStoredVideoLoadElapsedLabel = (elapsedMs) => {
  const safeElapsedMs = Number(elapsedMs);
  if (!Number.isFinite(safeElapsedMs) || safeElapsedMs < 0) return '';
  if (safeElapsedMs < 1000) return '1초 미만';

  const elapsedSeconds = Math.round(safeElapsedMs / 100) / 10;
  return `${Number.isInteger(elapsedSeconds) ? elapsedSeconds.toFixed(0) : elapsedSeconds.toFixed(1)}초`;
};

const getElapsedMessagePart = (elapsedMs) => {
  const elapsedLabel = getStoredVideoLoadElapsedLabel(elapsedMs);
  return elapsedLabel ? ` · ${elapsedLabel} 경과` : '';
};

export const getStoredVideoLoadProgressMessage = ({
  elapsedMs,
  pageCount = 0,
  videoCount = 0,
} = {}) => (
  `온라인 저장소(Azure DB) 수집 영상 조회 중: ${pageCount}페이지, ${videoCount}개를 확인했습니다${getElapsedMessagePart(elapsedMs)}. 전체 조회가 끝난 뒤 한 번에 표시하며 YouTube API는 호출하지 않습니다.`
);

export const getStoredVideosLoadedMessage = (videoCount, pageCount = 1, elapsedMs) => {
  const elapsedPart = getElapsedMessagePart(elapsedMs);

  return videoCount === 0
    ? `온라인 저장소(Azure DB) 조회 완료${elapsedPart}: 아직 수집된 영상 정보가 없습니다. 새 데이터가 필요할 때만 "선택 채널 새 영상 수집"을 실행해 주세요.`
    : `온라인 저장소(Azure DB) 조회 완료${elapsedPart}: 수집된 영상 정보 ${videoCount}개를 ${pageCount > 1 ? `${pageCount}페이지에서 모아 ` : ''}불러왔습니다. 새 YouTube API 호출은 없었습니다.`;
};

export const getStoredVideoLoadStartMessage = () => (
  '온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 불러오는 중입니다. YouTube API를 새로 호출하지 않습니다.'
);

export const getStoredVideoLoadErrorMessage = (error) => {
  const message = error?.message || STORED_VIDEO_LOAD_FAILED_MESSAGE;
  return `${message} 온라인 저장소(Azure DB) 조회를 완료하지 못했습니다. 새 YouTube API 호출이나 새 영상 수집은 실행하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

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

  return `${targetLabel} 새 영상 수집 중입니다. YouTube API 호출이 발생하며 수집 영상 목록 불러오기와 다른 작업입니다.`;
};

export const summarizeScanResults = (results = []) => (
  results.reduce((summary, result) => ({
    totalNew: summary.totalNew + (result.newVideosFound || 0),
    ttoTtoCount: summary.ttoTtoCount + (result.ttoTtoCandidates?.length || 0),
  }), { totalNew: 0, ttoTtoCount: 0 })
);

export const getScanCompleteMessage = (results = []) => {
  const { totalNew, ttoTtoCount } = summarizeScanResults(results);
  return `새 영상 수집 완료: 신규 영상 ${totalNew}개 확인${ttoTtoCount > 0 ? `, 또터또 후보 ${ttoTtoCount}개 확인` : ''}. 이후 수집 영상 목록 불러오기는 온라인 저장소(Azure DB) 조회입니다.`;
};

export const getScanErrorMessage = (error) => {
  const message = error?.message || '새 영상 수집에 실패했습니다.';
  return `새 영상 수집 실패: ${message} YouTube API 호출 결과가 정상 저장되었는지 확인하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};
