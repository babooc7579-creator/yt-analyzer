import { VIDEO_STATUS, VIDEO_STATUS_LABELS } from '../constants/status';

const getVideoTitle = (video = {}) => {
  const title = typeof video?.title === 'string' ? video.title.trim() : '';
  if (!title) return '선택한 영상';
  return title.length > 60 ? `${title.slice(0, 57)}...` : title;
};

export const getRadarProductionSuccessFeedback = (video) => ({
  actionLabel: '제작 후보함 열기',
  actionTitle: '온라인 저장소(Azure DB)의 제작 후보함을 엽니다. YouTube API를 호출하지 않습니다.',
  destination: 'production',
  message: `'${getVideoTitle(video)}' 영상을 온라인 저장소(Azure DB)의 제작 후보로 표시했습니다. 다음 후보가 자동으로 표시됩니다. 후보함에서 오늘 집중과 일정을 이어서 정할 수 있습니다.`,
  navigationIntent: {
    searchQuery: getVideoTitle(video),
    source: 'today-radar',
    targetVideoId: String(video?.videoId || '').trim(),
  },
  title: '제작 후보로 저장했습니다',
});

export const getRadarStatusSuccessFeedback = ({ status, video } = {}) => {
  const label = VIDEO_STATUS_LABELS[status] || '판단 완료';
  const title = {
    [VIDEO_STATUS.EXCLUDED]: '후보에서 제외했습니다',
    [VIDEO_STATUS.LEGACY_LATER]: '나중에 보기로 정리했습니다',
    [VIDEO_STATUS.REVIEWED]: '봤음으로 정리했습니다',
    [VIDEO_STATUS.WATCH_LATER]: '나중에 보기로 정리했습니다',
  }[status] || `${label} 상태로 정리했습니다`;

  return {
    actionLabel: '처리 기록 보기',
    actionTitle: '방금 처리한 영상을 확인하거나 레이더로 되돌릴 수 있는 처리 기록으로 이동합니다.',
    destination: 'decisions',
    message: `'${getVideoTitle(video)}' 영상의 판단을 온라인 저장소(Azure DB)에 저장했습니다. 다음 후보가 자동으로 표시됩니다. 실수했다면 처리 기록에서 레이더로 되돌릴 수 있습니다.`,
    title,
  };
};

export const getRadarScrapbookSuccessFeedback = ({ removed = false, video } = {}) => ({
  actionLabel: removed ? '' : '소재 보관함 열기',
  actionTitle: removed
    ? ''
    : '온라인 저장소(Azure DB)의 소재 보관함을 엽니다. YouTube API를 호출하지 않습니다.',
  destination: removed ? '' : 'scrapbook',
  message: removed
    ? `'${getVideoTitle(video)}' 영상을 온라인 저장소(Azure DB)의 소재 보관함에서 해제했습니다. 레이더 후보는 유지됩니다.`
    : `'${getVideoTitle(video)}' 영상을 온라인 저장소(Azure DB)의 소재 보관함에 보관했습니다. 레이더 후보는 유지되므로 봤음, 나중에 보기, 제작 후보, 제외 중 하나로 판단을 마저 선택하세요.`,
  title: removed ? '소재 보관을 해제했습니다' : '소재로 보관했습니다',
});
