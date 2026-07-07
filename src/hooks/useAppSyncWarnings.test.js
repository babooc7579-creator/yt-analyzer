import { describe, expect, it } from 'vitest';

import { useAppSyncWarnings } from './useAppSyncWarnings';

describe('useAppSyncWarnings', () => {
  it('returns video record and scrapbook warnings in display order', () => {
    expect(useAppSyncWarnings({
      videoRecordsSyncWarning: 'video records fallback warning',
      scrapbookSyncWarning: 'scrapbook fallback warning',
    })).toEqual([
      'video records fallback warning',
      'scrapbook fallback warning',
    ]);
  });

  it('filters empty warnings so the banner can stay hidden', () => {
    expect(useAppSyncWarnings({
      videoRecordsSyncWarning: '',
      scrapbookSyncWarning: null,
    })).toEqual([]);
  });

  it('keeps a single warning when only one storage area is degraded', () => {
    expect(useAppSyncWarnings({
      videoRecordsSyncWarning: '',
      scrapbookSyncWarning: 'scrapbook cloud unavailable',
    })).toEqual(['scrapbook cloud unavailable']);
  });
});
