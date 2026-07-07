import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  clearVideoUserRecords,
  fetchStoredVideosByChannelIds,
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
