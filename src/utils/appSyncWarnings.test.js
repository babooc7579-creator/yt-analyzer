import { describe, expect, it } from 'vitest';

import { getAppSyncWarnings } from './appSyncWarnings';

describe('app sync warning utils', () => {
  it('returns video record and scrapbook warnings in display order', () => {
    expect(getAppSyncWarnings({
      videoRecordsSyncWarning: 'video records fallback warning',
      scrapbookSyncWarning: 'scrapbook fallback warning',
    })).toEqual([
      'video records fallback warning',
      'scrapbook fallback warning',
    ]);
  });

  it('filters empty warnings so the banner can stay hidden', () => {
    expect(getAppSyncWarnings({
      videoRecordsSyncWarning: '',
      scrapbookSyncWarning: null,
    })).toEqual([]);
  });

  it('uses an empty object fallback when no warning model is provided', () => {
    expect(getAppSyncWarnings()).toEqual([]);
  });
});
