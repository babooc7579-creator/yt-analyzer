import { describe, expect, it } from 'vitest';

import { CHANNEL_GRADE, CHANNEL_STATUS } from '../constants/status';
import {
  filterAndSortChannelWatchlist,
  getChannelDaysSinceScan,
  getChannelWatchBulkSelection,
  getChannelWatchTagOptions,
  getChannelWatchlistCardViewProps,
  getChannelWatchlistSummary,
  getChannelWatchReasons,
} from './channelWatchlist';

const NOW = new Date('2026-07-13T00:00:00.000Z').getTime();

const channels = [
  {
    id: 's-never',
    title: 'S Never',
    category: '경제',
    grade: CHANNEL_GRADE.S,
    status: CHANNEL_STATUS.ACTIVE,
  },
  {
    id: 'a-old',
    title: 'A Old',
    tags: ['history'],
    grade: CHANNEL_GRADE.A,
    status: CHANNEL_STATUS.ACTIVE,
    lastScannedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'b-recent',
    title: 'B Recent',
    grade: CHANNEL_GRADE.B,
    status: CHANNEL_STATUS.ACTIVE,
    lastScanSummary: { scannedAt: '2026-07-12T00:00:00.000Z' },
  },
  {
    id: 'paused',
    title: 'Paused',
    grade: CHANNEL_GRADE.S,
    status: CHANNEL_STATUS.PAUSED,
  },
];

describe('channelWatchlist utils', () => {
  it('orders active channels by never-scanned, grade, and scan age priority', () => {
    expect(filterAndSortChannelWatchlist({ channels, now: NOW }).map(channel => channel.id)).toEqual([
      's-never',
      'a-old',
      'b-recent',
    ]);
  });

  it('filters by search, grade, and overdue scan age', () => {
    expect(filterAndSortChannelWatchlist({
      channels,
      gradeFilter: 'high',
      now: NOW,
      scanFilter: 'overdue30',
      searchQuery: 'history',
    }).map(channel => channel.id)).toEqual(['a-old']);
  });

  it('builds active-channel tag options and filters by tag and selection state', () => {
    expect(getChannelWatchTagOptions(channels)).toEqual([
      { value: '경제', count: 1, label: '경제 (1)' },
      { value: 'history', count: 1, label: 'history (1)' },
    ]);

    expect(filterAndSortChannelWatchlist({
      channels,
      selectedChannelIds: ['a-old'],
      selectionFilter: 'selected',
      tagFilter: 'history',
    }).map(channel => channel.id)).toEqual(['a-old']);

    expect(filterAndSortChannelWatchlist({
      channels,
      selectedChannelIds: ['a-old'],
      selectionFilter: 'unselected',
    }).map(channel => channel.id)).not.toContain('a-old');
  });

  it('bulk-selects only current results while preserving selections outside the filter', () => {
    expect(getChannelWatchBulkSelection({
      channels: [channels[0], channels[1]],
      selectedChannelIds: ['outside'],
      shouldSelect: true,
    })).toEqual(['outside', 's-never', 'a-old']);

    expect(getChannelWatchBulkSelection({
      channels: [channels[0], channels[1]],
      selectedChannelIds: ['outside', 's-never', 'a-old'],
      shouldSelect: false,
    })).toEqual(['outside']);
  });

  it('summarizes active, high-grade, never-scanned, selected, and visible channels', () => {
    const filteredChannels = filterAndSortChannelWatchlist({ channels, now: NOW });

    expect(getChannelWatchlistSummary({
      channels,
      filteredChannels,
      now: NOW,
      selectedChannelIds: ['a-old'],
    })).toEqual({
      activeChannelCount: 3,
      filteredChannelCount: 3,
      highGradeChannelCount: 2,
      neverScannedChannelCount: 1,
      savedChannelCount: 4,
      selectedChannelCount: 1,
    });
  });

  it('builds beginner-readable priority and selection copy', () => {
    expect(getChannelDaysSinceScan(channels[1], NOW)).toBe(42);
    expect(getChannelWatchReasons(channels[1], NOW)).toEqual([
      'A 등급 핵심 채널',
      '42일 동안 미확인',
    ]);

    expect(getChannelWatchlistCardViewProps({
      channel: channels[0],
      isSelected: true,
      now: NOW,
    })).toMatchObject({
      channelTitle: 'S Never',
      gradeLabel: '등급 S',
      scanText: '아직 수집 기록 없음',
      selectionLabel: '선택 해제',
    });
  });
});
