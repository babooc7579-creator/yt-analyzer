import { describe, expect, it, vi } from 'vitest';
import {
  KEYWORD_EXPLORER_SESSION_MAX_AGE_MS,
  KEYWORD_EXPLORER_SESSION_STORAGE_KEY,
  readKeywordExplorerSession,
  writeKeywordExplorerSession,
} from './keywordExplorerSessionStorage';

const createStorage = () => {
  const values = new Map();
  return {
    getItem: vi.fn((key) => values.get(key) || null),
    removeItem: vi.fn((key) => values.delete(key)),
    setItem: vi.fn((key, value) => values.set(key, value)),
  };
};

describe('keywordExplorerSessionStorage', () => {
  it('restores a recent temporary search session without persisting restore markers', () => {
    const storage = createStorage();
    const session = { source: 'youtube', videoSearch: { items: [{ videoId: 'video-1' }], selectedIds: ['video-1'] } };

    expect(writeKeywordExplorerSession({ ...session, _restoredFromSession: true }, { storage, now: 1000 })).toBe(true);
    expect(JSON.parse(storage.getItem(KEYWORD_EXPLORER_SESSION_STORAGE_KEY)).session).toEqual(session);
    expect(readKeywordExplorerSession({ storage, now: 2000 })).toEqual({
      ...session,
      _restoredAt: 1000,
      _restoredFromSession: true,
    });
  });

  it('removes a session older than six hours instead of showing stale metrics', () => {
    const storage = createStorage();
    writeKeywordExplorerSession({ source: 'youtube' }, { storage, now: 1000 });

    expect(readKeywordExplorerSession({ storage, now: 1000 + KEYWORD_EXPLORER_SESSION_MAX_AGE_MS + 1 })).toEqual({});
    expect(storage.removeItem).toHaveBeenCalledWith(KEYWORD_EXPLORER_SESSION_STORAGE_KEY);
  });

  it('fails safely when browser storage is unavailable or full', () => {
    const storage = { getItem: vi.fn(() => '{broken'), removeItem: vi.fn(), setItem: vi.fn(() => { throw new Error('quota'); }) };
    expect(readKeywordExplorerSession({ storage })).toEqual({});
    expect(writeKeywordExplorerSession({ source: 'youtube' }, { storage })).toBe(false);
  });
});
