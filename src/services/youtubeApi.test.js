import { afterEach, describe, expect, it, vi } from 'vitest';

import { YOUTUBE_API_BASE } from '../config';
import { fetchTopComments } from './youtubeApi';

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
