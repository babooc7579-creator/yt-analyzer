import { YOUTUBE_API_BASE } from '../config';

export const fetchTopComments = async ({ videoId, apiKey }) => {
  const params = new URLSearchParams({
    part: 'snippet',
    videoId,
    order: 'relevance',
    maxResults: '10',
    key: apiKey,
  });
  const response = await fetch(`${YOUTUBE_API_BASE}/commentThreads?${params.toString()}`);
  return response.json();
};
