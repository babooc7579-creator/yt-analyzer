import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  backfillChannelHistory,
  buildScanLogsPath,
  fetchScanLogs,
  scanChannels,
  scanSelectedChannels,
} from './scanApi';

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

describe('scanApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('uses the selected-channel scan endpoint for explicit manual scans', async () => {
    const fetchMock = installFetchMock();

    await scanSelectedChannels(['channel-1', 'channel-2']);

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan/selected`, {
      method: 'POST',
      body: JSON.stringify({
        channelIds: ['channel-1', 'channel-2'],
        reason: 'manual',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('uses the capped single-channel historical backfill endpoint', async () => {
    const fetchMock = installFetchMock();

    await backfillChannelHistory('channel-1', { maxPages: 10 });

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan/backfill`, {
      method: 'POST',
      body: JSON.stringify({
        channelId: 'channel-1',
        maxPages: 10,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('uses the base scan endpoint when no tag is provided', async () => {
    const fetchMock = installFetchMock();

    await scanChannels();

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan`);
  });

  it('keeps blank tag scans on the base scan endpoint', async () => {
    const fetchMock = installFetchMock();

    await scanChannels({ tag: '' });

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan`);
  });

  it('encodes tag scans in the query string', async () => {
    const fetchMock = installFetchMock();

    await scanChannels({ tag: 'shorts/a b' });

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan?tag=shorts%2Fa%20b`);
  });

  it('builds a safe Cloud scan-history query', () => {
    expect(buildScanLogsPath()).toBe('/scan-logs?pageSize=100');
    expect(buildScanLogsPath({
      channelId: 'channel/1',
      continuationToken: 'next token',
      pageSize: 50,
      status: 'failed',
    })).toBe('/scan-logs?pageSize=50&channelId=channel%2F1&status=failed&continuationToken=next+token');
  });

  it('reads scan history without starting a YouTube scan', async () => {
    const fetchMock = installFetchMock();

    await fetchScanLogs({ pageSize: 25 });

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scan-logs?pageSize=25`);
  });
});
