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
