import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  countActiveVideosWithoutDate,
  countDiscoveryRightsWarnings,
  countGroupedProductionVideos,
  getDiscoveryLinkCandidates,
  getProductionSummary,
  getScheduledProductionVideos,
  groupProductionVideos,
} from './productionKanbanData';

describe('productionKanbanData utils', () => {
  const videos = [
    { videoId: 'v1', title: 'Candidate A', multiplier: 12 },
    { videoId: 'v2', title: 'Active A', multiplier: 5 },
    { videoId: 'v3', title: 'Done A', multiplier: 2 },
    { videoId: 'v4', title: 'Candidate B', multiplier: 30 },
    { videoId: 'v5', title: 'No production status', multiplier: 99 },
  ];

  const records = {
    v1: { videoId: 'v1', statusIds: [PRODUCTION_STATUS.CANDIDATE] },
    v2: { videoId: 'v2', statusIds: [PRODUCTION_STATUS.ACTIVE], targetPublishDate: '2026-07-08' },
    v3: { videoId: 'v3', statusIds: [PRODUCTION_STATUS.DONE], uploadedAt: '2026-07-05T00:00:00.000Z' },
    v4: { videoId: 'v4', statusIds: [PRODUCTION_STATUS.REVIEWING] },
    v5: { videoId: 'v5', statusIds: [] },
  };

  it('counts videos across production groups safely', () => {
    expect(countGroupedProductionVideos({
      [PRODUCTION_STATUS.CANDIDATE]: [videos[0], videos[3]],
      [PRODUCTION_STATUS.ACTIVE]: [videos[1]],
      [PRODUCTION_STATUS.DONE]: [videos[2]],
      ignored: null,
    })).toBe(4);

    expect(countGroupedProductionVideos(null)).toBe(0);
  });

  it('filters discovery link candidates and sorts latest first', () => {
    const candidates = getDiscoveryLinkCandidates([
      { id: 'saved', status: 'saved', updatedAt: '2026-07-06T00:00:00.000Z' },
      { id: 'old', status: 'candidate', updatedAt: '2026-07-01T00:00:00.000Z' },
      { id: 'new', status: 'candidate', updatedAt: '2026-07-03T00:00:00.000Z' },
    ]);

    expect(candidates.map(link => link.id)).toEqual(['new', 'old']);
  });

  it('groups production videos by board status and keeps board sorting rules', () => {
    const grouped = groupProductionVideos(videos, {
      ...records,
      v6: { videoId: 'v6', statusIds: [PRODUCTION_STATUS.ACTIVE], targetPublishDate: '2026-07-01' },
    });

    expect(grouped[PRODUCTION_STATUS.CANDIDATE].map(video => video.videoId)).toEqual(['v4', 'v1']);
    expect(grouped[PRODUCTION_STATUS.ACTIVE].map(video => video.videoId)).toEqual(['v2']);
    expect(grouped[PRODUCTION_STATUS.DONE].map(video => video.videoId)).toEqual(['v3']);
  });

  it('builds scheduled videos from draft records before saved records', () => {
    const scheduled = getScheduledProductionVideos(videos, {
      v1: { targetPublishDate: '2026-07-02' },
    }, {
      v1: { targetPublishDate: '2026-07-10' },
      v2: { targetPublishDate: '2026-07-08' },
    });

    expect(scheduled.map(item => [item.video.videoId, item.date])).toEqual([
      ['v1', '2026-07-02'],
      ['v2', '2026-07-08'],
    ]);
  });

  it('counts discovery rights warnings and active videos missing target dates', () => {
    expect(countDiscoveryRightsWarnings([
      { id: 'safe', rightsStatus: 'cleared' },
      { id: 'check', rightsStatus: 'needs_check' },
      { id: 'blocked', rightsStatus: 'do_not_use' },
    ])).toBe(2);

    expect(countActiveVideosWithoutDate([
      { videoId: 'v1' },
      { videoId: 'v2' },
    ], {
      v1: { targetPublishDate: '2026-07-07' },
    }, {
      v2: {},
    })).toBe(1);
  });

  it('summarizes production board counts, schedule, and discovery warnings', () => {
    const groupedVideos = {
      [PRODUCTION_STATUS.CANDIDATE]: [videos[0]],
      [PRODUCTION_STATUS.ACTIVE]: [videos[1], { videoId: 'v6', title: 'Active B' }],
      [PRODUCTION_STATUS.DONE]: [videos[2]],
    };

    expect(getProductionSummary({
      discoveryLinkCandidates: [
        { id: 'check', rightsStatus: 'needs_check' },
        { id: 'safe', rightsStatus: 'cleared' },
      ],
      draftRecords: {
        v6: {},
      },
      groupedVideos,
      today: '2026-07-06',
      videoUserRecords: {
        v1: { targetPublishDate: '2026-07-01' },
        v2: { targetPublishDate: '2026-07-08' },
        v3: { uploadedAt: '2026-07-05T00:00:00.000Z' },
      },
    })).toMatchObject({
      videoCount: 4,
      candidateCount: 1,
      activeCount: 2,
      uploadedCount: 1,
      nextScheduled: {
        video: videos[1],
        date: '2026-07-08',
      },
      overdueCount: 1,
      discoveryRightsWarningCount: 1,
      activeWithoutDate: 1,
    });
  });
});
