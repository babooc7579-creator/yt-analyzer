import { YOUTUBE_API_BASE } from '../config';

export const fetchTopComments = async ({ videoId, apiKey }) => {
  const response = await fetch(`${YOUTUBE_API_BASE}/commentThreads?part=snippet&videoId=${videoId}&order=relevance&maxResults=10&key=${apiKey}`);
  return response.json();
};
