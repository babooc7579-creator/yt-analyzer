export const TTOTTO_MIN_DAYS_OLD = 180;
export const TTOTTO_MIN_MULTIPLIER = 1.5;
export const STRONG_REACTION_MULTIPLIER = 3;

export const parseDuration = (durationString) => {
  const match = durationString?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

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
  const viewCount = video.viewCount || 0;

  return {
    videoId: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    upload_date: video.uploadDate,
    channel_title: video.channelTitle,
    channel_id: video.channelId,
    language: video.language,
    daysOld,
    view_count: viewCount,
    like_count: video.likeCount || 0,
    like_ratio: video.likeRatio || 0,
    duration: video.duration || '00:00',
    isShorts: video.isShorts || false,
    multiplier: video.multiplier || 0,
    views_per_day: Math.round(viewCount / Math.max(1, daysOld)),
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
  let result = [...videos];

  if (searchKeyword) {
    const loweredKeyword = searchKeyword.toLowerCase();
    result = result.filter((video) => video.title.toLowerCase().includes(loweredKeyword));
  }

  if (viewFilter > 0) result = result.filter((video) => video.view_count >= viewFilter);
  if (lengthFilter === 'shorts') result = result.filter((video) => video.isShorts);
  else if (lengthFilter === 'long') result = result.filter((video) => !video.isShorts);
  if (ttoTtoMode) result = result.filter((video) => video.daysOld >= TTOTTO_MIN_DAYS_OLD);

  if (sortType === 'date') result.sort((a, b) => a.daysOld - b.daysOld);
  else if (sortType === 'views') result.sort((a, b) => b.view_count - a.view_count);
  else if (sortType === 'multiplier') result.sort((a, b) => b.multiplier - a.multiplier);
  else if (sortType === 'viral') result.sort((a, b) => b.views_per_day - a.views_per_day);
  else if (sortType === 'likes') result.sort((a, b) => b.like_ratio - a.like_ratio);

  return result;
};
