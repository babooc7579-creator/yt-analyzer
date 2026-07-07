import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  deleteScrapbookVideo,
  fetchScrapbook,
  saveScrapbookVideos,
} from './scrapbookApi';

const installFetchMock = () => {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: vi.fn(async () => ({ success: true })),
  }));

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
  });

  return fetchMock;
};

describe('scrapbookApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('loads the Cloud scrapbook endpoint', async () => {
    const fetchMock = installFetchMock();

    await fetchScrapbook();

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scrapbook`);
  });

  it('saves scrapbook videos in the expected Cloud payload shape', async () => {
    const fetchMock = installFetchMock();
    const videos = [{ videoId: 'video-1', title: 'Saved video' }];

    await saveScrapbookVideos(videos);

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scrapbook`, {
      method: 'POST',
      body: JSON.stringify({ videos }),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('deletes scrapbook videos with an encoded video id route', async () => {
    const fetchMock = installFetchMock();

    await deleteScrapbookVideo('video/id 1');

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scrapbook/video%2Fid%201`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
