import { describe, expect, it } from 'vitest';

import {
  getCloudOnlyTags,
  getLatestChannelScanDate,
} from './channels';

describe('channels utils', () => {
  it('returns the latest valid channel scan date', () => {
    const latest = getLatestChannelScanDate([
      { id: 'old', lastScannedAt: '2026-07-01T00:00:00.000Z' },
      { id: 'invalid', lastScannedAt: 'not-a-date' },
      { id: 'new', lastScanSummary: { scannedAt: '2026-07-03T12:30:00.000Z' } },
      { id: 'empty' },
    ]);

    expect(latest).toBeInstanceOf(Date);
    expect(latest.toISOString()).toBe('2026-07-03T12:30:00.000Z');
  });

  it('uses lastScanSummary scannedAt before legacy lastScannedAt on the same channel', () => {
    const latest = getLatestChannelScanDate([
      {
        id: 'summary-wins',
        lastScannedAt: '2026-07-05T00:00:00.000Z',
        lastScanSummary: { scannedAt: '2026-07-02T00:00:00.000Z' },
      },
    ]);

    expect(latest.toISOString()).toBe('2026-07-02T00:00:00.000Z');
  });

  it('returns null when no valid scan date exists', () => {
    expect(getLatestChannelScanDate([
      { id: 'missing' },
      { id: 'invalid', lastScanSummary: { scannedAt: 'bad-date' } },
    ])).toBeNull();

    expect(getLatestChannelScanDate()).toBeNull();
  });

  it('finds Cloud tags that are not present in the local category list', () => {
    expect(getCloudOnlyTags([
      { id: 'a', tags: ['history', ' food ', ''], category: 'science' },
      { id: 'b', tags: ['history', 'travel'], category: 'food' },
      { id: 'c', tags: null, category: 'mystery' },
    ], ['history', 'science'])).toEqual([
      'food',
      'mystery',
      'travel',
    ]);
  });

  it('handles missing channel and category lists safely', () => {
    expect(getCloudOnlyTags()).toEqual([]);
    expect(getCloudOnlyTags([
      { tags: ['beta'], category: 'alpha' },
      null,
      { tags: [' beta ', 1], category: '' },
    ])).toEqual(['alpha', 'beta']);
  });
});
