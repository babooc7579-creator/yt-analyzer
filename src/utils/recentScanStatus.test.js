import { describe, expect, it } from 'vitest';

import {
  filterRecentScanStatusRows,
  getRecentScanStatusRows,
  getRecentScanStatusSummary,
} from './recentScanStatus';

const channels = [
  {
    id: 'success',
    title: '성공 채널',
    grade: 'A',
    tags: ['랭킹형'],
    lastScanSummary: {
      status: 'success',
      scannedAt: '2026-07-26T10:00:00.000Z',
      newVideosFound: 3,
      statsRefreshed: 8,
    },
  },
  {
    id: 'failed',
    title: '실패 채널',
    lastScanSummary: {
      status: 'failed',
      scannedAt: '2026-07-26T09:00:00.000Z',
      error: 'quota warning',
    },
  },
  {
    id: 'partial',
    title: '부분 채널',
    lastScanSummary: {
      status: 'partial',
      scannedAt: '2026-07-26T08:00:00.000Z',
    },
  },
  {
    id: 'never',
    title: '미수집 채널',
  },
];

describe('recent scan status utils', () => {
  it('normalizes and orders failed, partial, never, and success rows', () => {
    const rows = getRecentScanStatusRows(channels);

    expect(rows.map((row) => row.status)).toEqual([
      'failed',
      'partial',
      'never',
      'success',
    ]);
    expect(rows.find((row) => row.channelId === 'success')).toMatchObject({
      grade: 'A',
      newVideosFound: 3,
      statsRefreshed: 8,
      tags: ['랭킹형'],
    });
  });

  it('treats a legacy lastScannedAt value as a successful latest result', () => {
    const [row] = getRecentScanStatusRows([{
      id: 'legacy',
      lastScannedAt: '2026-07-25T00:00:00.000Z',
      title: '기존 채널',
    }]);

    expect(row.status).toBe('success');
    expect(row.exactScannedAt).not.toBe('기록 없음');
  });

  it('builds a status summary without inventing past history', () => {
    expect(getRecentScanStatusSummary(getRecentScanStatusRows(channels))).toEqual({
      failed: 1,
      never: 1,
      partial: 1,
      success: 1,
      total: 4,
    });
  });

  it('filters by status and searches channel metadata or errors', () => {
    const rows = getRecentScanStatusRows(channels);

    expect(filterRecentScanStatusRows({ filter: 'failed', rows })).toHaveLength(1);
    expect(filterRecentScanStatusRows({ query: '랭킹형', rows }).map((row) => row.channelId)).toEqual(['success']);
    expect(filterRecentScanStatusRows({ query: 'quota', rows }).map((row) => row.channelId)).toEqual(['failed']);
  });
});
