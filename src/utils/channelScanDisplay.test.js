import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  formatRelativeTime,
  getChannelScanDisplay,
  getScanStatusMeta,
} from './channelScanDisplay';

describe('channelScanDisplay utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-07T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats relative scan times for recent and older dates', () => {
    expect(formatRelativeTime('2026-07-07T11:59:30.000Z')).toBe('방금 전');
    expect(formatRelativeTime('2026-07-07T11:45:00.000Z')).toBe('15분 전');
    expect(formatRelativeTime('2026-07-07T09:00:00.000Z')).toBe('3시간 전');
    expect(formatRelativeTime('2026-07-05T12:00:00.000Z')).toBe('2일 전');
    expect(formatRelativeTime('bad-date')).toBe('');
    expect(formatRelativeTime()).toBe('');
  });

  it('returns stable status metadata for scan states', () => {
    expect(getScanStatusMeta('success')).toMatchObject({
      label: 'success',
      className: expect.stringContaining('emerald'),
    });
    expect(getScanStatusMeta('partial')).toMatchObject({
      label: 'partial',
      className: expect.stringContaining('amber'),
    });
    expect(getScanStatusMeta('failed')).toMatchObject({
      label: 'failed',
      className: expect.stringContaining('red'),
    });
    expect(getScanStatusMeta('unknown')).toMatchObject({
      className: expect.stringContaining('slate'),
    });
  });

  it('builds summary display from lastScanSummary first', () => {
    expect(getChannelScanDisplay({
      lastScannedAt: '2026-07-01T00:00:00.000Z',
      lastScanSummary: {
        scannedAt: '2026-07-07T10:00:00.000Z',
        status: 'partial',
        newVideosFound: 12,
        statsRefreshed: 34,
        coverageRate: 0.875,
        error: 'quota warning',
      },
    })).toMatchObject({
      statusMeta: {
        label: 'partial',
      },
      scannedText: '2시간 전',
      newVideosFound: '12',
      statsRefreshed: '34',
      coverageRate: '87.5%',
      hasSummary: true,
      error: 'quota warning',
    });
  });

  it('falls back to legacy lastScannedAt when summary is missing', () => {
    expect(getChannelScanDisplay({
      lastScannedAt: '2026-07-07T11:00:00.000Z',
    })).toMatchObject({
      statusMeta: {
        label: 'success',
      },
      scannedText: '1시간 전',
      newVideosFound: '-',
      statsRefreshed: '-',
      coverageRate: null,
      hasSummary: false,
      error: null,
    });
  });

  it('shows an unscanned state when no scan date exists', () => {
    const display = getChannelScanDisplay({});

    expect(display.statusMeta.className).toContain('slate');
    expect(display.scannedText).toBe('미수집');
    expect(display.hasSummary).toBe(false);
  });
});
