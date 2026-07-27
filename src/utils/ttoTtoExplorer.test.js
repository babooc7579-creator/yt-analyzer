import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  filterAndSortTtoTtoCandidates,
  getAllTtoTtoCandidates,
  getTtoTtoExplorerDataModel,
  getTtoTtoExplorerEmptyState,
} from './ttoTtoExplorer';

const videos = [
  {
    videoId: 'old-strong-short',
    title: 'Old strong cake',
    channel_title: 'Cake Lab',
    daysOld: 365,
    multiplier: 4,
    view_count: 2000000,
    like_ratio: 5,
    isShorts: true,
  },
  {
    videoId: 'old-steady-long',
    title: 'Steady workshop',
    channel_title: 'Maker Lab',
    daysOld: 220,
    multiplier: 2,
    view_count: 150000,
    like_ratio: 3,
    isShorts: false,
  },
  {
    videoId: 'old-low-reaction',
    title: 'Old but weak',
    channel_title: 'Maker Lab',
    daysOld: 500,
    multiplier: 1.4,
    view_count: 9000000,
    isShorts: false,
  },
  {
    videoId: 'new-strong',
    title: 'New strong',
    channel_title: 'Cake Lab',
    daysOld: 30,
    multiplier: 8,
    view_count: 5000000,
    isShorts: true,
  },
];

describe('ttoTtoExplorer utils', () => {
  it('uses both age and reaction thresholds for candidates', () => {
    expect(getAllTtoTtoCandidates(videos).map(video => video.videoId)).toEqual([
      'old-strong-short',
      'old-steady-long',
    ]);
  });

  it('searches title and channel, filters format and views, and sorts candidates', () => {
    expect(filterAndSortTtoTtoCandidates({
      videos,
      searchQuery: 'cake lab',
      lengthFilter: 'shorts',
      minimumViews: 1000000,
      sortType: 'views',
    }).map(video => video.videoId)).toEqual(['old-strong-short']);

    expect(filterAndSortTtoTtoCandidates({
      videos,
      sortType: 'oldest',
    }).map(video => video.videoId)).toEqual(['old-strong-short', 'old-steady-long']);
  });

  it('keeps large candidate lists searchable and sorted', () => {
    const largeVideos = Array.from({ length: 1000 }, (_, index) => ({
      videoId: `large-${index}`,
      title: index % 2 === 0 ? `Cake archive ${index}` : `Workshop archive ${index}`,
      channel_title: `Channel ${index % 20}`,
      daysOld: 180 + index,
      multiplier: 2 + (index / 1000),
      view_count: index * 1000,
      isShorts: index % 3 === 0,
    }));

    const matches = filterAndSortTtoTtoCandidates({
      videos: largeVideos,
      searchQuery: 'cake',
      minimumViews: 500000,
      sortType: 'views',
    });

    expect(matches).toHaveLength(250);
    expect(matches[0].videoId).toBe('large-998');
    expect(matches.at(-1).videoId).toBe('large-500');
  });

  it('hides handled records while keeping strict candidate decision history', () => {
    const videoUserRecords = {
      'old-strong-short': {
        statusIds: [VIDEO_STATUS.REVIEWED, PRODUCTION_STATUS.CANDIDATE],
      },
    };
    const filteredCandidates = filterAndSortTtoTtoCandidates({
      videos,
      videoUserRecords,
    });
    const model = getTtoTtoExplorerDataModel({
      filteredCandidates,
      videos,
      videoUserRecords,
    });

    expect(filteredCandidates.map(video => video.videoId)).toEqual(['old-steady-long']);
    expect(model.summary).toEqual({
      filteredCandidateCount: 1,
      handledCandidateCount: 1,
      loadedVideoCount: 4,
      openCandidateCount: 1,
      totalCandidateCount: 2,
    });
    expect(model.loadedDecisionCount).toBe(2);
  });

  it('builds distinct empty states for unloaded, completed, and filtered views', () => {
    expect(getTtoTtoExplorerEmptyState({
      loadedVideoCount: 0,
      selectedChannelCount: 2,
    })).toMatchObject({
      kind: 'not-loaded',
      actionLabel: '수집 영상 목록 불러오기',
      actionAriaLabel: expect.stringContaining('온라인 저장소(Azure DB) 조회이며 YouTube API 호출 없음'),
    });

    expect(getTtoTtoExplorerEmptyState({
      loadedVideoCount: 3,
      openCandidateCount: 0,
    })).toMatchObject({ kind: 'completed' });

    expect(getTtoTtoExplorerEmptyState({
      hasActiveFilters: true,
      loadedVideoCount: 3,
      openCandidateCount: 2,
    })).toMatchObject({
      kind: 'filtered',
      actionLabel: '필터 초기화',
      actionTitle: expect.stringContaining('온라인 저장소(Azure DB) 데이터나 처리 기록은 바꾸지 않으며'),
    });
  });
});
