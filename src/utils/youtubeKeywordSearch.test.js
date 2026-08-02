import { describe, expect, it } from 'vitest';
import {
  buildYoutubeSearchOptions,
  filterYoutubeSearchResults,
  getPublishedAfter,
  toDiscoveryLinkPayload,
} from './youtubeKeywordSearch';

describe('youtubeKeywordSearch', () => {
  it('builds an explicit one-page search request', () => {
    const now = new Date('2026-08-02T00:00:00.000Z');
    expect(getPublishedAfter('30', now)).toBe('2026-07-03T00:00:00.000Z');
    expect(buildYoutubeSearchOptions({
      query: ' 아이디어 ', order: 'viewCount', duration: 'medium', regionCode: 'KR', language: 'ko', dateRange: 'all',
    })).toMatchObject({ q: '아이디어', maxResults: 25, order: 'viewCount', videoDuration: 'medium', regionCode: 'KR' });
  });

  it('filters locally and turns only a selected result into a discovery link', () => {
    expect(filterYoutubeSearchResults([{ videoId: '1', viewCount: 9999 }, { videoId: '2', viewCount: 10000 }], 10000))
      .toEqual([{ videoId: '2', viewCount: 10000 }]);
    expect(toDiscoveryLinkPayload({ videoId: '2', title: '좋은 영상', channelTitle: '좋은 채널' }, '경제'))
      .toEqual({
        url: 'https://www.youtube.com/watch?v=2', platform: 'youtube', title: '좋은 영상', linkedVideoId: '2', status: 'inbox',
        memo: '키워드 검색: 경제 · 채널: 좋은 채널',
      });
  });
});
