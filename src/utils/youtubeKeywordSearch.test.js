import { describe, expect, it } from 'vitest';
import {
  buildYoutubeSearchOptions,
  addYoutubeChannelRegistrationSelections,
  filterYoutubeChannelResults,
  filterYoutubeVideoResultsByChannelRegistration,
  filterYoutubeSearchResults,
  formatYoutubeChannelCountry,
  formatYoutubeSearchCriteria,
  getPublishedAfter,
  hasYoutubeSearchCriteriaChanges,
  MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION,
  prepareYoutubeSearchTargetSession,
  sortYoutubeChannelResults,
  toggleYoutubeChannelRegistrationSelection,
  toDiscoveryLinkPayload,
} from './youtubeKeywordSearch';

describe('youtubeKeywordSearch', () => {
  it('builds an explicit one-page search request', () => {
    const now = new Date('2026-08-02T00:00:00.000Z');
    expect(getPublishedAfter('30', now)).toBe('2026-07-03T00:00:00.000Z');
    expect(getPublishedAfter('60', now)).toBe('2026-06-03T00:00:00.000Z');
    expect(getPublishedAfter('year', now)).toBe('2026-01-01T00:00:00.000Z');
    expect(buildYoutubeSearchOptions({
      query: ' 아이디어 ', order: 'viewCount', duration: 'medium', regionCode: 'KR', language: 'ko', dateRange: 'all',
    })).toMatchObject({ q: '아이디어', maxResults: 25, order: 'viewCount', videoDuration: 'medium', regionCode: 'KR' });
  });

  it('filters locally and turns only a selected result into a discovery link', () => {
    expect(filterYoutubeSearchResults([{ videoId: '1', viewCount: 9999 }, { videoId: '2', viewCount: 10000 }], 10000))
      .toEqual([{ videoId: '2', viewCount: 10000 }]);
    expect(toDiscoveryLinkPayload({ videoId: '2', title: '좋은 영상', channelTitle: '좋은 채널' }, '경제', [' 카이온학습 ', '카이온학습']))
      .toEqual({
        url: 'https://www.youtube.com/watch?v=2', platform: 'youtube', title: '좋은 영상', linkedVideoId: '2', status: 'inbox',
        tags: ['카이온학습'],
        memo: '키워드 검색: 경제 · 채널: 좋은 채널',
      });
  });

  it('explains region availability and language priority in applied criteria', () => {
    expect(formatYoutubeSearchCriteria({
      regionCode: 'KR', language: 'ko', dateRange: '30', duration: '', order: 'relevance',
    })).toBe('대한민국에서 시청 가능 · 한국어 우선 · 최근 30일 · 영상 길이 전체 · 관련도순');
    expect(formatYoutubeSearchCriteria({ regionCode: 'GB', language: 'en' }, { includeVideoFilters: false }))
      .toBe('영국에서 시청 가능 · 영어 우선');
    expect(formatYoutubeSearchCriteria({ dateRange: 'year' })).toContain('올해');
  });

  it('detects unapplied API criteria but ignores locally applied view thresholds', () => {
    const applied = { query: 'copilot', regionCode: 'KR', language: 'ko', dateRange: '30', duration: '', order: 'relevance' };
    expect(hasYoutubeSearchCriteriaChanges({ ...applied, minimumViews: 10000 }, applied)).toBe(false);
    expect(hasYoutubeSearchCriteriaChanges({ ...applied, language: 'en' }, applied)).toBe(true);
    expect(hasYoutubeSearchCriteriaChanges({ query: 'copilot', regionCode: 'KR', language: '' }, applied, { includeVideoFilters: false })).toBe(true);
  });

  it('carries common filters into an empty video or channel search without replacing existing work', () => {
    const sourceSession = { filters: { query: 'MS Copilot', regionCode: 'KR', language: 'ko', dateRange: '30' } };
    expect(prepareYoutubeSearchTargetSession({ sourceSession, targetLabel: '채널 찾기' })).toMatchObject({
      filters: { query: 'MS Copilot', regionCode: 'KR', language: 'ko' },
      notice: expect.stringContaining('검색 버튼을 누르기 전에는 YouTube API를 호출하지 않습니다'),
    });

    const existingTarget = { filters: { query: '바이브 코딩', regionCode: 'US', language: 'en' }, items: [{ channelId: '1' }] };
    expect(prepareYoutubeSearchTargetSession({ sourceSession, targetSession: existingTarget, targetLabel: '채널 찾기' }))
      .toBe(existingTarget);
  });

  it('sorts already received channels locally and explains declared country', () => {
    const channels = [
      { channelId: 'a', title: '가', subscriberCount: 100, avgViewCount: 500, totalVideoCount: 20 },
      { channelId: 'b', title: '나', subscriberCount: 300, avgViewCount: 100, totalVideoCount: 10 },
    ];
    expect(sortYoutubeChannelResults(channels, 'subscriberCount').map((item) => item.channelId)).toEqual(['b', 'a']);
    expect(sortYoutubeChannelResults(channels, 'avgViewCount').map((item) => item.channelId)).toEqual(['a', 'b']);
    expect(formatYoutubeChannelCountry('KR')).toBe('대한민국');
    expect(formatYoutubeChannelCountry('')).toBe('미등록');
  });

  it('filters received channels locally by registration, country, and comparison selection', () => {
    const channels = [
      { channelId: 'a', country: 'KR' },
      { channelId: 'b', country: '' },
      { channelId: 'c', country: 'US' },
    ];
    expect(filterYoutubeChannelResults(channels, { registration: 'unregistered', country: 'declared', selection: 'all' }, {
      registeredIds: ['a'], selectedIds: ['c'],
    }).map((item) => item.channelId)).toEqual(['c']);
    expect(filterYoutubeChannelResults(channels, { registration: 'all', country: 'all', selection: 'selected' }, {
      registeredIds: new Set(['a']), selectedIds: new Set(['b']),
    }).map((item) => item.channelId)).toEqual(['b']);
  });

  it('keeps registration candidates separate from comparison and caps them at 50', () => {
    expect(MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION).toBe(50);
    expect(toggleYoutubeChannelRegistrationSelection(['a'], 'b')).toEqual({ ids: ['a', 'b'], limitReached: false });
    expect(toggleYoutubeChannelRegistrationSelection(['a', 'b'], 'a')).toEqual({ ids: ['b'], limitReached: false });
    const selection = addYoutubeChannelRegistrationSelections([], Array.from({ length: 51 }, (_, index) => `c-${index}`));
    expect(selection.ids).toHaveLength(50);
    expect(selection.limitReached).toBe(true);
  });

  it('filters video results by the source channel registration state without changing the result set', () => {
    const videos = [{ videoId: '1', channelId: 'a' }, { videoId: '2', channelId: 'b' }];
    expect(filterYoutubeVideoResultsByChannelRegistration(videos, 'registered', ['a'])).toEqual([videos[0]]);
    expect(filterYoutubeVideoResultsByChannelRegistration(videos, 'unregistered', new Set(['a']))).toEqual([videos[1]]);
    expect(filterYoutubeVideoResultsByChannelRegistration(videos, 'all', ['a'])).toEqual(videos);
  });
});
