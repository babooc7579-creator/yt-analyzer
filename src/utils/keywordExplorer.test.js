import { describe, expect, it } from 'vitest';

import {
  KEYWORD_EXPLORER_RESULT_LIMIT,
  filterKeywordExplorerVideos,
  getKeywordExplorerEmptyState,
  getKeywordExplorerSummary,
  getKeywordSuggestions,
  tokenizeKeywordText,
} from './keywordExplorer';

const videos = [
  { videoId: 'v1', title: 'Amazing Cake Table Build', channel_title: 'Maker Lab', daysOld: 200, view_count: 200000, multiplier: 4, isShorts: true },
  { videoId: 'v2', title: 'Chocolate Cake Recipe', channel_title: 'Food Lab', daysOld: 20, view_count: 50000, multiplier: 2, isShorts: false },
  { videoId: 'v3', title: 'Old Table Restoration', channel_title: 'Maker Lab', daysOld: 400, view_count: 900000, multiplier: 6, isShorts: false },
];

describe('keywordExplorer utils', () => {
  it('tokenizes useful words and drops simple stop words', () => {
    expect(tokenizeKeywordText('This AMAZING cake-video 2026')).toEqual(['amazing', 'cake']);
  });

  it('builds frequent title suggestions without counting duplicates in one title twice', () => {
    const suggestions = getKeywordSuggestions([
      ...videos,
      { title: 'Cake cake design' },
    ]);

    expect(suggestions[0]).toMatchObject({
      label: 'cake',
      count: 3,
      channelCount: 2,
      reactionScore: expect.any(Number),
    });
    expect(suggestions[0].reactionScore).toBeGreaterThanOrEqual(0);
    expect(suggestions[0].reactionScore).toBeLessThanOrEqual(100);
    expect(suggestions.some(item => item.label === 'video')).toBe(false);
  });

  it('scores repeated, cross-channel, recent, and high-response title keywords without external APIs', () => {
    const suggestions = getKeywordSuggestions([
      { title: 'Cake surprise', channel_id: 'c1', daysOld: 5, view_count: 100000, multiplier: 8 },
      { title: 'Cake challenge', channel_id: 'c2', daysOld: 12, view_count: 80000, multiplier: 6 },
      { title: 'Quiet workshop', channel_id: 'c1', daysOld: 200, view_count: 1000, multiplier: 0.2 },
    ]);

    expect(suggestions[0]).toMatchObject({
      label: 'cake',
      channelCount: 2,
      count: 2,
      recentVideoCount: 2,
    });
    expect(suggestions[0].reactionScore).toBeGreaterThan(suggestions.find(item => item.label === 'quiet').reactionScore);
  });

  it('searches title and channel text and applies view, length, and age filters', () => {
    expect(filterKeywordExplorerVideos({ videos, searchQuery: 'cake' }).map(video => video.videoId)).toEqual(['v1', 'v2']);
    expect(filterKeywordExplorerVideos({ videos, searchQuery: 'maker', ageFilter: 'legacy180', lengthFilter: 'long' }).map(video => video.videoId)).toEqual(['v3']);
    expect(filterKeywordExplorerVideos({ videos, searchQuery: 'table', minimumViews: 500000 }).map(video => video.videoId)).toEqual(['v3']);
  });

  it('sorts results by the selected stored-video signal', () => {
    expect(filterKeywordExplorerVideos({ videos, searchQuery: 'lab', sortType: 'views' }).map(video => video.videoId)).toEqual(['v3', 'v1', 'v2']);
    expect(filterKeywordExplorerVideos({ videos, searchQuery: 'lab', sortType: 'newest' }).map(video => video.videoId)).toEqual(['v2', 'v1', 'v3']);
  });

  it('keeps large stored-video searches deterministic', () => {
    const largeVideos = Array.from({ length: 1000 }, (_, index) => ({
      videoId: `large-${index}`,
      title: index % 2 === 0 ? `Cake idea ${index}` : `Workshop idea ${index}`,
      channel_title: `Channel ${index % 25}`,
      daysOld: index,
      view_count: index * 1000,
      multiplier: index / 10,
      isShorts: index % 3 === 0,
    }));

    const matches = filterKeywordExplorerVideos({
      videos: largeVideos,
      searchQuery: 'cake',
      minimumViews: 500000,
      sortType: 'views',
    });

    expect(matches).toHaveLength(250);
    expect(matches[0].videoId).toBe('large-998');
    expect(matches.at(-1).videoId).toBe('large-500');
    expect(matches.slice(0, KEYWORD_EXPLORER_RESULT_LIMIT)).toHaveLength(60);
  });

  it('summarizes matched videos without changing the result limit', () => {
    const summary = getKeywordExplorerSummary({
      matchedVideos: videos,
      shownVideoCount: 2,
      videos: [...videos, { videoId: 'v4' }],
    });

    expect(KEYWORD_EXPLORER_RESULT_LIMIT).toBe(60);
    expect(summary).toMatchObject({
      averageViews: 383333,
      channelCount: 2,
      loadedVideoCount: 4,
      matchedVideoCount: 3,
      shownVideoCount: 2,
      strongestMultiplier: 6,
    });
  });

  it('separates not-loaded, waiting-for-query, and no-match empty states', () => {
    expect(getKeywordExplorerEmptyState({ loadedVideoCount: 0, selectedChannelCount: 0 })).toMatchObject({ action: 'channels' });
    expect(getKeywordExplorerEmptyState({ loadedVideoCount: 0, selectedChannelCount: 2 })).toMatchObject({
      action: 'load',
      actionAriaLabel: expect.stringContaining('Cloud DB 조회이며 YouTube API 호출 없음'),
      actionTitle: expect.stringContaining('새 YouTube API 호출은 없습니다'),
    });
    expect(getKeywordExplorerEmptyState({ loadedVideoCount: 10, hasQuery: false })).toMatchObject({ action: 'none' });
    expect(getKeywordExplorerEmptyState({ loadedVideoCount: 10, hasQuery: true })).toMatchObject({
      action: 'reset',
      actionTitle: expect.stringContaining('Cloud 데이터나 저장 상태는 바꾸지 않으며'),
    });
  });
});
