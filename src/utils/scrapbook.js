import { PRODUCTION_STATUSES, hasAnyProductionStatus } from '../constants/status';
import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const getVideoId = (video) => toVideoObject(video).videoId;

const getVideoTitle = (video) => toVideoObject(video).title || '이 영상';

export const SCRAPBOOK_LOAD_FAILED_MESSAGE =
  '스크랩북을 불러오지 못했습니다.';

export const SCRAPBOOK_DELETE_FAILED_MESSAGE =
  '스크랩북에서 삭제하지 못했습니다.';

export const SCRAPBOOK_SAVE_FAILED_MESSAGE =
  '스크랩북에 저장하지 못했습니다.';

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const getCloudScrapbookVideos = (videos) => (
  Array.isArray(videos) ? videos.filter(video => video && typeof video === 'object') : []
);

export const hasScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).some(video => getVideoId(video) === videoId)
);

export const removeScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).filter(video => getVideoId(video) !== videoId)
);

export const upsertScrapbookVideo = (videos, video) => {
  const nextVideo = toVideoObject(video);
  const videoId = getVideoId(nextVideo);
  if (!videoId) return getCloudScrapbookVideos(videos);

  return [
    ...removeScrapbookVideo(videos, videoId),
    nextVideo,
  ];
};

export const getNextScrapbookVideos = (videos, video, isSaved) => (
  isSaved
    ? removeScrapbookVideo(videos, getVideoId(video))
    : upsertScrapbookVideo(videos, video)
);

export const getScrapbookVideoUrlList = (savedVideos = []) => formatNumberedUrlList(
  getCloudScrapbookVideos(savedVideos)
    .filter((video) => getVideoId(video))
    .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
);

export const getScrapbookVideoCardViewProps = (video) => {
  const sourceVideo = toVideoObject(video);
  const videoTitle = getVideoTitle(sourceVideo);

  return {
    videoTitle,
    videoUrl: getYouTubeVideoUrl(sourceVideo.videoId),
  };
};

export const getScrapbookVideoFooterStatsViewProps = (video) => {
  const sourceVideo = toVideoObject(video);

  return {
    label: '조회수 / 참여율',
    likeRatioText: `(${toNumber(sourceVideo.like_ratio)}%)`,
    viewCountText: toNumber(sourceVideo.view_count).toLocaleString(),
  };
};

export const getScrapbookVideoInfoViewProps = ({
  video,
  videoUrl,
} = {}) => {
  const sourceVideo = toVideoObject(video);
  const videoTitle = getVideoTitle(sourceVideo);

  return {
    channelTitle: sourceVideo.channel_title || '',
    title: videoTitle,
    titleLinkProps: {
      'aria-label': `${videoTitle} YouTube 원본 영상 열기`,
      href: videoUrl,
      title: videoTitle,
    },
  };
};

export const getScrapbookVideoThumbnailViewProps = ({
  video,
  videoTitle,
} = {}) => {
  const sourceVideo = toVideoObject(video);
  const displayTitle = videoTitle || getVideoTitle(sourceVideo);

  return {
    durationText: sourceVideo.duration,
    imageProps: {
      alt: `${displayTitle} 썸네일`,
      src: `https://i.ytimg.com/vi/${sourceVideo.videoId}/hqdefault.jpg`,
    },
    shortsLabel: 'Shorts',
    showShortsLabel: Boolean(sourceVideo.isShorts),
  };
};

export const getProductionScopedVideos = (savedVideos = [], videoUserRecords = {}) => {
  const records = toRecordMap(videoUserRecords);

  return getCloudScrapbookVideos(savedVideos).filter(video => hasAnyProductionStatus(
    records[getVideoId(video)],
    PRODUCTION_STATUSES,
  ));
};

export const getScrapbookWorkspaceViewProps = ({
  creatorView,
  discoveryLinks,
  copiedPrompt,
  promptCopyError,
  savedVideos,
  videoUserRecords,
  onCopyPrompt,
  onFetchComments,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenHome,
  onOpenReferenceVault,
  onRemoveScrap,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
}) => {
  const savedVideoList = getCloudScrapbookVideos(savedVideos);
  const isProductionView = creatorView === 'studio-candidates';
  const headerVideos = isProductionView
    ? getProductionScopedVideos(savedVideoList, videoUserRecords)
    : savedVideoList;
  const videoUrlList = getScrapbookVideoUrlList(headerVideos);

  return {
    getScrapbookVideoCardProps: (video) => ({
      video,
      onFetchComments,
      onRemoveScrap,
    }),
    headerProps: {
      savedVideoCount: headerVideos.length,
      copiedPrompt,
      promptCopyError,
      onCopyPrompt,
      videoUrlList,
      variant: isProductionView ? 'production' : 'scrapbook',
    },
    isProductionView,
    isScrapbookEmpty: savedVideoList.length === 0,
    productionKanbanProps: {
      discoveryLinks,
      videos: savedVideoList,
      videoUserRecords,
      onMoveVideo,
      onOpenDiscoveryLinks,
      onOpenHome,
      onUpdateDiscoveryLink,
      onUpdateVideoRecord,
      onOpenReferenceVault,
    },
  };
};
