import { describe, expect, it } from 'vitest';

import { CHANNEL_STATUS, PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  countActiveSelectedChannels,
  countDiscoveryCandidates,
  countDiscoveryRightsWarnings,
  countLoadedRadarDecisions,
  countOpenRadarCandidates,
  countProductionCandidates,
  countScannableChannels,
  countTtoTtoAssets,
  countVisibleScraps,
} from './creatorOsMetrics';

describe('creatorOsMetrics utils', () => {
  const channels = [
    { id: 'active-a', status: CHANNEL_STATUS.ACTIVE },
    { id: 'paused-a', status: CHANNEL_STATUS.PAUSED },
    { id: 'discarded-a', status: CHANNEL_STATUS.DISCARDED },
    { id: 'default-active' },
    null,
  ];

  const videos = [
    { videoId: 'v1', daysOld: 220, multiplier: 2 },
    { videoId: 'v2', daysOld: 20, multiplier: 5 },
    { videoId: 'v3', daysOld: 365, multiplier: 1.2 },
    { videoId: 'v4', daysOld: 365, multiplier: 3 },
  ];

  const videoUserRecords = {
    v1: { videoId: 'v1', statusIds: [VIDEO_STATUS.REVIEWED] },
    v2: { videoId: 'v2', statusIds: [PRODUCTION_STATUS.CANDIDATE] },
    v3: { videoId: 'v3', statusIds: [VIDEO_STATUS.EXCLUDED] },
    v4: { videoId: 'v4', statusIds: [] },
  };

  it('counts channels that are currently eligible for scanning', () => {
    expect(countScannableChannels(channels)).toBe(2);
    expect(countScannableChannels(null)).toBe(0);
  });

  it('counts selected channels only when they are scannable', () => {
    expect(countActiveSelectedChannels(channels, [
      'active-a',
      'paused-a',
      'default-active',
      'missing',
    ])).toBe(2);

    expect(countActiveSelectedChannels(channels, null)).toBe(0);
  });

  it('counts tteotteotto assets by age and multiplier threshold', () => {
    expect(countTtoTtoAssets(videos)).toBe(2);
    expect(countTtoTtoAssets([null, { daysOld: 999, multiplier: 0 }])).toBe(0);
  });

  it('counts loaded scraps visible in the current video list', () => {
    expect(countVisibleScraps(videos, [
      { videoId: 'v1' },
      { videoId: 'v4' },
      { videoId: 'not-loaded' },
      {},
    ])).toBe(2);
  });

  it('splits radar videos into decided and still-open candidates', () => {
    expect(countLoadedRadarDecisions(videos, videoUserRecords)).toBe(3);
    expect(countOpenRadarCandidates(videos, videoUserRecords)).toBe(1);
  });

  it('counts production candidates from saved videos and user records', () => {
    expect(countProductionCandidates([
      { videoId: 'v1' },
      { videoId: 'v2' },
      { videoId: 'v4' },
    ], videoUserRecords)).toBe(1);
  });

  it('counts discovery candidates and rights warnings only for candidate links', () => {
    const links = [
      { id: 'candidate-safe', status: 'candidate', rightsStatus: 'cleared' },
      { id: 'candidate-check', status: 'candidate', rightsStatus: 'needs_check' },
      { id: 'candidate-blocked', status: 'candidate', rightsStatus: 'do_not_use' },
      { id: 'saved-check', status: 'saved', rightsStatus: 'needs_check' },
      { id: 'inbox-default' },
    ];

    expect(countDiscoveryCandidates(links)).toBe(3);
    expect(countDiscoveryRightsWarnings(links)).toBe(2);
  });
});
