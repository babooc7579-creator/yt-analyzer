import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import { scanChannels, scanSelectedChannels } from './scanApi';

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
});
