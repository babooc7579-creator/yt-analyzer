import { describe, expect, it } from 'vitest';

import {
  filterRecentScanStatusRows,
  formatChannelGrade,
  getBackfillCoverageDisplay,
  getScanHistoryRuns,
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
  it('caps display percentages without changing raw Cloud counts', () => {
    expect(getBackfillCoverageDisplay({
      channelTotalVideos: 1017,
      coverageRate: 100.1,
      savedVideosTotal: 1018,
      videosInspectedTotal: 1019,
    })).toEqual({
      displayCoverageRate: 100,
      inspectionCountLabel: '1,019개 확인 · 채널 통계 1,017개',
      savedAboveChannelTotal: 1,
      statisticsMismatch: true,
    });
  });

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

  it('preserves Cloud coverage fields used to explain a partial result', () => {
    const [row] = getRecentScanStatusRows([{
      id: 'partial',
      backfillState: {
        inspectionProgressRate: 25,
        videosInspectedTotal: 100,
      },
      lastScanSummary: {
        status: 'partial',
        savedVideosTotal: 250,
        channelTotalVideos: 400,
        estimatedMissingVideos: 150,
        coverageRate: 62.5,
      },
    }]);

    expect(row).toMatchObject({
      backfillActionLabel: '이어서 과거 영상 수집',
      backfillPhase: 'in_progress',
      backfillStatusLabel: '과거 목록 확인 25%',
      savedVideosTotal: 250,
      channelTotalVideos: 400,
      estimatedMissingVideos: 150,
      coverageRate: 62.5,
      inspectionProgressRate: 25,
      videosInspectedTotal: 100,
    });
  });

  it('marks a completed public upload inspection separately from Cloud coverage', () => {
    const [row] = getRecentScanStatusRows([{
      id: 'completed',
      backfillState: {
        completed: true,
        inspectionProgressRate: 100,
        videosInspectedTotal: 1017,
        lastRun: {
          coverageRate: 82,
          estimatedMissingVideos: 183,
          savedVideosTotal: 834,
          channelTotalVideos: 1017,
        },
      },
      lastScanSummary: {
        status: 'partial',
        scannedAt: '2026-07-27T10:00:00.000Z',
      },
    }]);

    expect(row).toMatchObject({
      backfillActionLabel: '',
      backfillCompleted: true,
      backfillPhase: 'completed',
      backfillStatusLabel: '공개 업로드 목록 끝까지 확인 완료',
      coverageRate: 82,
      inspectionProgressRate: 100,
      status: 'success',
    });
  });

  it('keeps raw values while preparing safe display values above 100 percent', () => {
    const [row] = getRecentScanStatusRows([{
      id: 'completed-above-statistics',
      backfillState: {
        completed: true,
        inspectionProgressRate: 100,
        videosInspectedTotal: 1019,
        lastRun: {
          coverageRate: 100.1,
          savedVideosTotal: 1018,
          channelTotalVideos: 1017,
        },
      },
      lastScanSummary: {
        status: 'success',
        scannedAt: '2026-07-27T10:00:00.000Z',
      },
    }]);

    expect(row).toMatchObject({
      coverageRate: 100.1,
      displayCoverageRate: 100,
      inspectionCountLabel: '1,019개 확인 · 채널 통계 1,017개',
      savedAboveChannelTotal: 1,
      savedVideosTotal: 1018,
      statisticsMismatch: true,
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

  it('uses operator-friendly grade labels', () => {
    expect(formatChannelGrade('unclassified')).toBe('미분류');
    expect(formatChannelGrade('a')).toBe('A');
    expect(formatChannelGrade('특별 관리')).toBe('특별 관리');
  });

  it('groups channel records by a single scan execution', () => {
    const runs = getScanHistoryRuns([
      {
        id: 'log-2',
        scanRunId: 'run-1',
        channelTitle: '두번째 채널',
        status: 'failed',
        scannedAt: '2026-07-27T01:00:01.000Z',
        error: 'quota warning',
      },
      {
        id: 'log-1',
        scanRunId: 'run-1',
        channelTitle: '첫번째 채널',
        status: 'success',
        scannedAt: '2026-07-27T01:00:00.000Z',
        newVideosFound: 2,
        statsRefreshed: 5,
        trigger: 'selected',
      },
      {
        id: 'legacy-log',
        channelTitle: '기존 채널',
        status: 'success',
        scannedAt: '2026-07-26T01:00:00.000Z',
        newVideosFound: 1,
      },
    ]);

    expect(runs).toHaveLength(2);
    expect(runs[0]).toMatchObject({
      id: 'run-1',
      channelCount: 2,
      failed: 1,
      newVideosFound: 2,
      statsRefreshed: 5,
      status: 'partial',
      success: 1,
      trigger: 'selected',
    });
    expect(runs[0].logs.map((log) => log.channelTitle)).toEqual(['두번째 채널', '첫번째 채널']);
    expect(runs[1]).toMatchObject({
      channelCount: 1,
      status: 'success',
    });
  });
});
