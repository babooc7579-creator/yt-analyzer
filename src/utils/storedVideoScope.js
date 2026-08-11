const isVideo = (video) => video && typeof video === 'object';
const toVideoList = (videos) => {
  if (!Array.isArray(videos)) return [];
  return videos.every(isVideo) ? videos : videos.filter(isVideo);
};

export function getConfirmedStoredVideos({
  selectedChannelKey = '',
  storedVideoLoadResult,
  videos,
} = {}) {
  if (!selectedChannelKey) return [];
  if (storedVideoLoadResult?.success !== true) return [];
  if (storedVideoLoadResult.selectionKey !== selectedChannelKey) return [];
  return toVideoList(videos);
}
