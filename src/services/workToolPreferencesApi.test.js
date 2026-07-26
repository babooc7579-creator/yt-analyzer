import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  fetchWorkToolPreferences,
  saveWorkToolPreferences,
} from './workToolPreferencesApi';

describe('workToolPreferencesApi', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('loads and saves the Cloud preference document', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        preferences: { customTools: [], hiddenDefaultToolIds: [], toolOrder: [] },
      }),
    }));
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: fetchMock });

    await fetchWorkToolPreferences();
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/work-tool-preferences`);

    const preferences = {
      customTools: [{ id: 'custom-1', label: '내 도구', href: 'https://example.com/' }],
      hiddenDefaultToolIds: ['youtube-studio'],
      toolOrder: ['custom-1', 'google-trends'],
    };
    await saveWorkToolPreferences(preferences);
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/work-tool-preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
