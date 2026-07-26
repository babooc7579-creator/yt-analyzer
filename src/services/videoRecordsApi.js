import { deleteJson, getJson, postJson } from './functionApiClient';

export const STORED_VIDEO_PAGE_SIZE = 200;
export const MAX_STORED_VIDEO_PAGES = 1000;

export const fetchStoredVideosByChannelIds = (channelIds) => (
  getJson(`/videos?channelIds=${channelIds.join(',')}`)
);

export const fetchStoredVideosPageByChannelIds = (
  channelIds,
  {
    continuationToken = '',
    pageSize = STORED_VIDEO_PAGE_SIZE,
  } = {},
) => {
  const query = new URLSearchParams({
    channelIds: channelIds.join(','),
    pageSize: String(pageSize),
  });

  if (continuationToken) {
    query.set('continuationToken', continuationToken);
  }

  return getJson(`/videos?${query.toString()}`);
};

export const fetchAllStoredVideosByChannelIds = async (
  channelIds,
  {
    maxPages = MAX_STORED_VIDEO_PAGES,
    onPage,
    pageSize = STORED_VIDEO_PAGE_SIZE,
  } = {},
) => {
  const videos = [];
  const seenContinuationTokens = new Set();
  let continuationToken = '';

  for (let pageCount = 1; pageCount <= maxPages; pageCount += 1) {
    const data = await fetchStoredVideosPageByChannelIds(channelIds, {
      continuationToken,
      pageSize,
    });

    if (!data.success) {
      return {
        ...data,
        pageCount: pageCount - 1,
        videos: [],
      };
    }

    videos.push(...(Array.isArray(data.videos) ? data.videos : []));
    onPage?.({
      pageCount,
      videoCount: videos.length,
    });

    const nextContinuationToken = data.continuationToken || '';
    if (!nextContinuationToken) {
      return {
        success: true,
        videos,
        pageCount,
      };
    }

    if (seenContinuationTokens.has(nextContinuationToken)) {
      return {
        success: false,
        error: 'Cloud DB 페이지 정보가 반복되어 저장 영상 조회를 안전하게 중단했습니다.',
        pageCount,
        videos: [],
      };
    }

    seenContinuationTokens.add(nextContinuationToken);
    continuationToken = nextContinuationToken;
  }

  return {
    success: false,
    error: '저장 영상 조회 페이지 수가 안전 한도를 초과했습니다.',
    pageCount: maxPages,
    videos: [],
  };
};

export const fetchVideoUserRecords = () => getJson('/video-records');

export const saveVideoUserRecord = (record) => (
  postJson('/video-records', record)
);

export const clearVideoUserRecords = () => (
  deleteJson('/video-records')
);
