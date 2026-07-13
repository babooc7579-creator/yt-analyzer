import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  countActiveVideosWithoutDate,
  countDiscoveryRightsWarnings,
  countGroupedProductionVideos,
  getDiscoveryLinkCandidates,
  getProductionFocusVideos,
  getProductionKanbanGroupStatus,
  getProductionKanbanDataModel,
  getProductionSummary,
  getScheduledProductionVideos,
  groupProductionVideos,
  isProductionFocusRecord,
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

  it('separates manually focused candidate videos and keeps their pin order', () => {
    const focusedRecords = {
      ...records,
      v1: {
        ...records.v1,
        focusPinnedAt: '2026-07-13T09:30:00.000Z',
      },
      v4: {
        ...records.v4,
        focusPinnedAt: '2026-07-13T08:30:00.000Z',
      },
    };

    expect(isProductionFocusRecord(focusedRecords.v1)).toBe(true);
    expect(isProductionFocusRecord(records.v2)).toBe(false);
    expect(getProductionFocusVideos(videos, focusedRecords).map(video => video.videoId)).toEqual(['v4', 'v1']);

    const grouped = groupProductionVideos(videos, focusedRecords);
    expect(grouped[PRODUCTION_STATUS.CANDIDATE]).toEqual([]);
    expect(grouped[PRODUCTION_STATUS.ACTIVE].map(video => video.videoId)).toEqual(['v2']);
    expect(grouped[PRODUCTION_STATUS.DONE].map(video => video.videoId)).toEqual(['v3']);
  });

  it('keeps long-term production statuses visible in the three-column MVP board', () => {
    expect(getProductionKanbanGroupStatus(PRODUCTION_STATUS.REVIEWING)).toBe(PRODUCTION_STATUS.CANDIDATE);
    expect(getProductionKanbanGroupStatus(PRODUCTION_STATUS.DECIDED)).toBe(PRODUCTION_STATUS.CANDIDATE);
    expect(getProductionKanbanGroupStatus(PRODUCTION_STATUS.ON_HOLD)).toBe(PRODUCTION_STATUS.CANDIDATE);
    expect(getProductionKanbanGroupStatus(PRODUCTION_STATUS.ACTIVE)).toBe(PRODUCTION_STATUS.ACTIVE);
    expect(getProductionKanbanGroupStatus(PRODUCTION_STATUS.DONE)).toBe(PRODUCTION_STATUS.DONE);

    const legacyVideos = [
      { videoId: 'reviewing', multiplier: 3 },
      { videoId: 'decided', multiplier: 2 },
      { videoId: 'on-hold', multiplier: 1 },
    ];
    const grouped = groupProductionVideos(legacyVideos, {
      reviewing: { statusIds: [PRODUCTION_STATUS.REVIEWING] },
      decided: { statusIds: [PRODUCTION_STATUS.DECIDED] },
      'on-hold': { statusIds: [PRODUCTION_STATUS.ON_HOLD] },
    });

    expect(grouped[PRODUCTION_STATUS.CANDIDATE].map(video => video.videoId)).toEqual([
      'reviewing',
      'decided',
      'on-hold',
    ]);
    expect(grouped[PRODUCTION_STATUS.ACTIVE]).toEqual([]);
    expect(grouped[PRODUCTION_STATUS.DONE]).toEqual([]);
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
      focusVideos: [{ videoId: 'focus-1', title: 'Focused candidate' }],
      groupedVideos,
      today: '2026-07-06',
      videoUserRecords: {
        v1: { targetPublishDate: '2026-07-01' },
        v2: { targetPublishDate: '2026-07-08' },
        v3: { uploadedAt: '2026-07-05T00:00:00.000Z' },
      },
    })).toMatchObject({
      videoCount: 5,
      candidateCount: 2,
      focusCount: 1,
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

  it('keeps video production candidates separate from discovery link candidates in the summary', () => {
    const discoveryLinkCandidates = getDiscoveryLinkCandidates([
      { id: 'saved-link', status: 'saved', rightsStatus: 'needs_check', updatedAt: '2026-07-08T00:00:00.000Z' },
      { id: 'link-safe', status: 'candidate', rightsStatus: 'cleared', updatedAt: '2026-07-07T00:00:00.000Z' },
      { id: 'link-check', status: 'candidate', rightsStatus: 'needs_check', updatedAt: '2026-07-06T00:00:00.000Z' },
      { id: 'link-blocked', status: 'candidate', rightsStatus: 'do_not_use', updatedAt: '2026-07-05T00:00:00.000Z' },
    ]);

    const summary = getProductionSummary({
      discoveryLinkCandidates,
      draftRecords: {},
      groupedVideos: {
        [PRODUCTION_STATUS.CANDIDATE]: [videos[0], videos[3]],
        [PRODUCTION_STATUS.ACTIVE]: [videos[1]],
        [PRODUCTION_STATUS.DONE]: [],
      },
      today: '2026-07-08',
      videoUserRecords: {},
    });

    expect(discoveryLinkCandidates.map(link => link.id)).toEqual([
      'link-safe',
      'link-check',
      'link-blocked',
    ]);
    expect(summary).toMatchObject({
      videoCount: 3,
      candidateCount: 2,
      activeCount: 1,
      uploadedCount: 0,
      discoveryRightsWarningCount: 2,
    });
  });

  it('builds production kanban data model with video and discovery candidates kept separate', () => {
    const model = getProductionKanbanDataModel({
      discoveryLinks: [
        { id: 'saved-link', status: 'saved', rightsStatus: 'needs_check', updatedAt: '2026-07-08T00:00:00.000Z' },
        { id: 'new-link', status: 'candidate', rightsStatus: 'needs_check', updatedAt: '2026-07-09T00:00:00.000Z' },
        { id: 'old-link', status: 'candidate', rightsStatus: 'cleared', updatedAt: '2026-07-01T00:00:00.000Z' },
      ],
      draftRecords: {
        v2: { targetPublishDate: '2026-07-10' },
      },
      today: '2026-07-08',
      videoUserRecords: records,
      videos,
    });

    expect(model.discoveryLinkCandidates.map(link => link.id)).toEqual(['new-link', 'old-link']);
    expect(model.focusVideos).toEqual([]);
    expect(model.groupedVideos[PRODUCTION_STATUS.CANDIDATE].map(video => video.videoId)).toEqual(['v4', 'v1']);
    expect(model.groupedVideos[PRODUCTION_STATUS.ACTIVE].map(video => video.videoId)).toEqual(['v2']);
    expect(model.productionSummary).toMatchObject({
      activeCount: 1,
      candidateCount: 2,
      discoveryRightsWarningCount: 1,
      uploadedCount: 1,
      videoCount: 4,
    });
    expect(model.productionSummary.nextScheduled).toMatchObject({
      date: '2026-07-10',
      video: videos[1],
    });
  });

  it('keeps focused videos in the summary while removing duplicates from the candidate column', () => {
    const model = getProductionKanbanDataModel({
      discoveryLinks: [],
      videoUserRecords: {
        ...records,
        v1: {
          ...records.v1,
          focusPinnedAt: '2026-07-13T08:00:00.000Z',
        },
      },
      videos,
    });

    expect(model.focusVideos.map(video => video.videoId)).toEqual(['v1']);
    expect(model.groupedVideos[PRODUCTION_STATUS.CANDIDATE].map(video => video.videoId)).toEqual(['v4']);
    expect(model.productionSummary).toMatchObject({
      candidateCount: 2,
      focusCount: 1,
      videoCount: 4,
    });
  });
});
