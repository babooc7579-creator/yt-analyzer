import { afterEach, describe, expect, it, vi } from 'vitest';

import { YOUTUBE_API_BASE } from '../config';
import {
  YOUTUBE_API_REQUEST_FAILED_MESSAGE,
  YOUTUBE_COMMENTS_RESPONSE_READ_FAILED_MESSAGE,
  fetchTopComments,
} from './youtubeApi';

const installFetchMock = (response) => {
  const fetchMock = vi.fn(async () => response);

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
  });

  return fetchMock;
};

describe('youtubeApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('keeps YouTube API fallback copy centralized', () => {
    expect(YOUTUBE_API_REQUEST_FAILED_MESSAGE).toBe('YouTube API 요청에 실패했습니다.');
    expect(YOUTUBE_COMMENTS_RESPONSE_READ_FAILED_MESSAGE).toBe(
      'YouTube 댓글 응답을 읽지 못했습니다. 잠시 뒤 다시 시도해 주세요.'
    );
  });

  it('requests top comments through the YouTube commentThreads API', async () => {
    const payload = { items: [{ id: 'comment-1' }] };
    const fetchMock = installFetchMock({
      ok: true,
      json: vi.fn(async () => payload),
    });

    const result = await fetchTopComments({
      videoId: 'video/a b',
      apiKey: 'key+with space',
    });

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(`${requestUrl.origin}${requestUrl.pathname}`).toBe(`${YOUTUBE_API_BASE}/commentThreads`);
    expect(requestUrl.searchParams.get('part')).toBe('snippet');
    expect(requestUrl.searchParams.get('videoId')).toBe('video/a b');
    expect(requestUrl.searchParams.get('order')).toBe('relevance');
    expect(requestUrl.searchParams.get('maxResults')).toBe('10');
    expect(requestUrl.searchParams.get('key')).toBe('key+with space');
  });

  it('preserves YouTube error payloads when the API returns them', async () => {
    const payload = { error: { message: 'quota exceeded' } };
    installFetchMock({
      ok: false,
      status: 403,
      json: vi.fn(async () => payload),
    });

    await expect(fetchTopComments({ videoId: 'video-1', apiKey: 'key-1' })).resolves.toEqual(payload);
  });

  it('normalizes failed HTTP responses without readable error payloads', async () => {
    installFetchMock({
      ok: false,
      status: 500,
      json: vi.fn(async () => ({ items: [] })),
    });

    const result = await fetchTopComments({ videoId: 'video-1', apiKey: 'key-1' });

    expect(result.error.message).toContain('500');
  });

  it('normalizes unreadable YouTube responses', async () => {
    installFetchMock({
      ok: true,
      json: vi.fn(async () => {
        throw new Error('invalid json');
      }),
    });

    const result = await fetchTopComments({ videoId: 'video-1', apiKey: 'key-1' });

    expect(result.error.message).toBeTruthy();
  });
});
