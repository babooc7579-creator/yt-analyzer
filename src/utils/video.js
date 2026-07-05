export const TTOTTO_MIN_DAYS_OLD = 180;
export const TTOTTO_MIN_MULTIPLIER = 1.5;
export const STRONG_REACTION_MULTIPLIER = 3;

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const toVideoList = (videos) => (
  Array.isArray(videos) ? videos.filter(video => video && typeof video === 'object') : []
);

const toText = (value) => (typeof value === 'string' ? value : '');

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const parseDuration = (durationString) => {
  const match = toText(durationString).match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    return { isShorts: false, formatted: '00:00', totalSeconds: 0 };
  }

  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;
  const seconds = parseInt(match[3], 10) || 0;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const isShorts = totalSeconds <= 61;

  let formatted = '';

  if (hours > 0) {
    formatted += `${hours}:`;
  }

  formatted += `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { isShorts, formatted, totalSeconds };
};

export const mapCloudVideoToViewModel = (video, daysOld) => {
  const sourceVideo = toVideoObject(video);
  const viewCount = toNumber(sourceVideo.viewCount);
  const daysOldValue = toNumber(daysOld);

  return {
    videoId: sourceVideo.id,
    title: sourceVideo.title,
    thumbnail: sourceVideo.thumbnail,
    upload_date: sourceVideo.uploadDate,
    channel_title: sourceVideo.channelTitle,
    channel_id: sourceVideo.channelId,
    language: sourceVideo.language,
    daysOld: daysOldValue,
    view_count: viewCount,
    like_count: toNumber(sourceVideo.likeCount),
    like_ratio: toNumber(sourceVideo.likeRatio),
    duration: sourceVideo.duration || '00:00',
    isShorts: Boolean(sourceVideo.isShorts),
    multiplier: toNumber(sourceVideo.multiplier),
    views_per_day: Math.round(viewCount / Math.max(1, daysOldValue)),
  };
};

export const isTtoTtoCandidate = (video) => (
  Number(video?.daysOld || 0) >= TTOTTO_MIN_DAYS_OLD
  && Number(video?.multiplier || 0) >= TTOTTO_MIN_MULTIPLIER
);

export const hasStrongReaction = (video) => (
  Number(video?.multiplier || 0) >= STRONG_REACTION_MULTIPLIER
);

export const filterAndSortVideos = ({
  videos,
  searchKeyword,
  viewFilter,
  lengthFilter,
  ttoTtoMode,
  sortType,
}) => {
  let result = toVideoList(videos);
  const minimumViews = toNumber(viewFilter);

  if (searchKeyword) {
    const loweredKeyword = toText(searchKeyword).toLowerCase();
    result = result.filter((video) => toText(video.title).toLowerCase().includes(loweredKeyword));
  }

  if (minimumViews > 0) result = result.filter((video) => toNumber(video.view_count) >= minimumViews);
  if (lengthFilter === 'shorts') result = result.filter((video) => video.isShorts);
  else if (lengthFilter === 'long') result = result.filter((video) => !video.isShorts);
  if (ttoTtoMode) result = result.filter((video) => toNumber(video.daysOld) >= TTOTTO_MIN_DAYS_OLD);

  if (sortType === 'date') result.sort((a, b) => toNumber(a.daysOld) - toNumber(b.daysOld));
  else if (sortType === 'views') result.sort((a, b) => toNumber(b.view_count) - toNumber(a.view_count));
  else if (sortType === 'multiplier') result.sort((a, b) => toNumber(b.multiplier) - toNumber(a.multiplier));
  else if (sortType === 'viral') result.sort((a, b) => toNumber(b.views_per_day) - toNumber(a.views_per_day));
  else if (sortType === 'likes') result.sort((a, b) => toNumber(b.like_ratio) - toNumber(a.like_ratio));

  return result;
};
