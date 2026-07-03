import { YOUTUBE_API_BASE } from '../config';

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
      return createYoutubeErrorResponse(`YouTube API 요청에 실패했습니다. (${response.status})`);
    }
    return data;
  }

  return createYoutubeErrorResponse('YouTube 댓글 응답을 읽지 못했습니다. 잠시 뒤 다시 시도해 주세요.');
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
