import { describe, expect, it } from 'vitest';

import {
  TAG_VAULT_RESULT_LIMIT,
  filterTagVaultVideos,
  getTagVaultChannelIds,
  getTagVaultEmptyState,
  getTagVaultFacets,
  getTagVaultSummary,
} from './tagVault';

const channels = [
  { id: 'c1', title: 'Maker Lab', tags: ['공예', '해외'], category: '쇼츠' },
  { id: 'c2', title: 'Food Lab', tags: ['요리', '해외'], category: '롱폼' },
  { id: 'c3', title: 'Old Lab', tags: ['공예'], category: '' },
];

const videos = [
  { videoId: 'v1', channel_id: 'c1', title: 'Cake table', view_count: 100, multiplier: 2, daysOld: 30, isShorts: true },
  { videoId: 'v2', channel_id: 'c2', title: 'Cake recipe', view_count: 300, multiplier: 1, daysOld: 5, isShorts: false },
  { videoId: 'v3', channel_id: 'c3', title: 'Old table', view_count: 200, multiplier: 5, daysOld: 400, isShorts: false },
];

describe('tagVault utils', () => {
  it('builds unique tag facets from channel tags and categories', () => {
    expect(getTagVaultFacets(channels).find((facet) => facet.label === '해외')).toEqual({ channelCount: 2, channelIds: ['c1', 'c2'], label: '해외' });
    expect(getTagVaultChannelIds(channels, '공예')).toEqual(['c1', 'c3']);
  });

  it('filters loaded videos to the selected tag channels', () => {
    expect(filterTagVaultVideos({ channels, selectedTag: '공예', videos }).map((video) => video.videoId)).toEqual(['v3', 'v1']);
    expect(filterTagVaultVideos({ channels, lengthFilter: 'shorts', searchQuery: 'cake', selectedTag: '공예', videos }).map((video) => video.videoId)).toEqual(['v1']);
  });

  it('keeps large tag searches scoped and sorted', () => {
    const largeChannels = Array.from({ length: 100 }, (_, index) => ({
      id: `channel-${index}`,
      tags: index % 2 === 0 ? ['공예'] : ['요리'],
    }));
    const largeVideos = Array.from({ length: 1000 }, (_, index) => ({
      videoId: `large-${index}`,
      channel_id: `channel-${index % 100}`,
      title: `Stored idea ${index}`,
      view_count: index,
      multiplier: index,
      daysOld: index,
      isShorts: index % 3 === 0,
    }));

    const matches = filterTagVaultVideos({
      channels: largeChannels,
      selectedTag: '공예',
      sortType: 'views',
      videos: largeVideos,
    });

    expect(matches).toHaveLength(500);
    expect(matches[0].videoId).toBe('large-998');
    expect(matches.at(-1).videoId).toBe('large-0');
    expect(matches.slice(0, TAG_VAULT_RESULT_LIMIT)).toHaveLength(60);
  });

  it('summarizes current tag data without changing the display limit', () => {
    expect(TAG_VAULT_RESULT_LIMIT).toBe(60);
    expect(getTagVaultSummary({ channels, matchedVideos: videos.slice(0, 2), selectedChannelIds: ['c1'], selectedTag: '해외', shownVideoCount: 2, videos })).toEqual({
      loadedVideoCount: 3,
      matchedVideoCount: 2,
      selectedChannelCount: 1,
      shownVideoCount: 2,
      tagChannelCount: 2,
      tagCount: 5,
    });
  });

  it('separates channel, load, and filtered empty states', () => {
    expect(getTagVaultEmptyState({ channelCount: 0 })).toMatchObject({ action: 'channels' });
    expect(getTagVaultEmptyState({ channelCount: 2, tagCount: 2, loadedVideoCount: 0, selectedChannelCount: 1 })).toMatchObject({
      action: 'load',
      actionAriaLabel: expect.stringContaining('온라인 저장소(Azure DB) 조회이며 YouTube API 호출 없음'),
    });
    expect(getTagVaultEmptyState({ channelCount: 2, tagCount: 2, loadedVideoCount: 10, hasActiveFilters: true })).toMatchObject({
      action: 'reset',
      actionTitle: expect.stringContaining('온라인 저장소(Azure DB) 데이터나 저장 상태는 바꾸지 않으며'),
    });
  });
});
