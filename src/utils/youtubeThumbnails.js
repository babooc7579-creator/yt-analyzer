const THUMBNAIL_QUALITY_FILES = {
  high: ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg'],
  standard: ['sddefault.jpg', 'hqdefault.jpg'],
};

const toUniqueList = (items) => [...new Set(items.filter(Boolean))];

export const getYouTubeThumbnailCandidates = ({
  preferredQuality = 'high',
  src = '',
  videoId = '',
} = {}) => {
  const qualityFiles = THUMBNAIL_QUALITY_FILES[preferredQuality]
    || THUMBNAIL_QUALITY_FILES.high;
  const generatedUrls = videoId
    ? qualityFiles.map(fileName => `https://i.ytimg.com/vi/${videoId}/${fileName}`)
    : [];

  return toUniqueList([...generatedUrls, src]);
};

export const getNextThumbnailCandidateIndex = ({ candidateCount = 0, currentIndex = 0 } = {}) => (
  currentIndex + 1 < candidateCount ? currentIndex + 1 : currentIndex
);
