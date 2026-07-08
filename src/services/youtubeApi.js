import { YOUTUBE_API_BASE } from '../config';

export const YOUTUBE_API_REQUEST_FAILED_MESSAGE =
  'YouTube API 요청에 실패했습니다.';

export const YOUTUBE_COMMENTS_RESPONSE_READ_FAILED_MESSAGE =
  'YouTube 댓글 응답을 읽지 못했습니다. 잠시 뒤 다시 시도해 주세요.';

const createYoutubeErrorResponse = (message) => ({
  error: {
    message,
  },
});

const readYoutubeJsonResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (data && typeof data === 'object') {
    if (!response.ok && !data.error) {
      return createYoutubeErrorResponse(`${YOUTUBE_API_REQUEST_FAILED_MESSAGE} (${response.status})`);
    }
    return data;
  }

  return createYoutubeErrorResponse(YOUTUBE_COMMENTS_RESPONSE_READ_FAILED_MESSAGE);
};

export const fetchTopComments = async ({ videoId, apiKey }) => {
  const params = new URLSearchParams({
    part: 'snippet',
    videoId,
    order: 'relevance',
    maxResults: '10',
    key: apiKey,
  });
  const response = await fetch(`${YOUTUBE_API_BASE}/commentThreads?${params.toString()}`);
  return readYoutubeJsonResponse(response);
};
