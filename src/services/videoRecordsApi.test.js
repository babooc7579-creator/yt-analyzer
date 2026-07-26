import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  clearVideoUserRecords,
  fetchAllStoredVideosByChannelIds,
  fetchStoredVideosByChannelIds,
  fetchStoredVideosPageByChannelIds,
  fetchVideoUserRecords,
  saveVideoUserRecord,
} from './videoRecordsApi';

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

describe('videoRecordsApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('loads stored videos through the DB lookup endpoint', async () => {
    const fetchMock = installFetchMock();

    await fetchStoredVideosByChannelIds(['channel-1', 'channel-2']);

    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTION_API_BASE}/videos?channelIds=channel-1,channel-2`,
    );
  });

  it('loads a stored-video page with encoded paging parameters', async () => {
    const fetchMock = installFetchMock();

    await fetchStoredVideosPageByChannelIds(
      ['channel-1', 'channel-2'],
      {
        continuationToken: 'next+/=token',
        pageSize: 200,
      },
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTION_API_BASE}/videos?channelIds=channel-1%2Cchannel-2&pageSize=200&continuationToken=next%2B%2F%3Dtoken`,
    );
  });

  it('collects every stored-video page before returning the final list', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn(async () => ({
          success: true,
          videos: [{ id: 'video-1' }, { id: 'video-2' }],
          continuationToken: 'page-2',
          hasMore: true,
        })),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn(async () => ({
          success: true,
          videos: [{ id: 'video-3' }],
          continuationToken: null,
          hasMore: false,
        })),
      });
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: fetchMock,
    });
    const onPage = vi.fn();

    const result = await fetchAllStoredVideosByChannelIds(
      ['channel-1'],
      { onPage, pageSize: 2 },
    );

    expect(result).toEqual({
      success: true,
      videos: [{ id: 'video-1' }, { id: 'video-2' }, { id: 'video-3' }],
      pageCount: 2,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${FUNCTION_API_BASE}/videos?channelIds=channel-1&pageSize=2`,
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${FUNCTION_API_BASE}/videos?channelIds=channel-1&pageSize=2&continuationToken=page-2`,
    );
    expect(onPage).toHaveBeenNthCalledWith(1, { pageCount: 1, videoCount: 2 });
    expect(onPage).toHaveBeenNthCalledWith(2, { pageCount: 2, videoCount: 3 });
  });

  it('does not expose a partial list when a later page fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn(async () => ({
          success: true,
          videos: [{ id: 'video-1' }],
          continuationToken: 'page-2',
        })),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: vi.fn(async () => ({
          success: false,
          error: 'Cloud unavailable',
        })),
      });
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: fetchMock,
    });

    const result = await fetchAllStoredVideosByChannelIds(['channel-1']);

    expect(result).toEqual({
      success: false,
      error: 'Cloud unavailable',
      pageCount: 1,
      videos: [],
    });
  });

  it('stops safely when the backend repeats a continuation token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn(async () => ({
          success: true,
          videos: [{ id: 'video-1' }],
          continuationToken: 'repeated-token',
        })),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn(async () => ({
          success: true,
          videos: [{ id: 'video-2' }],
          continuationToken: 'repeated-token',
        })),
      });
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: fetchMock,
    });

    const result = await fetchAllStoredVideosByChannelIds(['channel-1']);

    expect(result).toEqual({
      success: false,
      error: 'Cloud DB 페이지 정보가 반복되어 저장 영상 조회를 안전하게 중단했습니다.',
      pageCount: 2,
      videos: [],
    });
  });

  it('loads video user records from the Cloud records endpoint', async () => {
    const fetchMock = installFetchMock();

    await fetchVideoUserRecords();

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/video-records`);
  });

  it('saves video user records without dropping statusIds', async () => {
    const fetchMock = installFetchMock();
    const record = {
      videoId: 'video-1',
      status: 'production_candidate',
      statusIds: ['production_candidate', 'reference_material'],
    };

    await saveVideoUserRecord(record);

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/video-records`, {
      method: 'POST',
      body: JSON.stringify(record),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('clears video user records with the records delete endpoint', async () => {
    const fetchMock = installFetchMock();

    await clearVideoUserRecords();

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/video-records`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
