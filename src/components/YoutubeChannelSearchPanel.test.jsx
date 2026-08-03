import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../hooks/useYoutubeChannelSearch', () => ({
  useYoutubeChannelSearch: vi.fn(() => ({
    appliedFilters: { query: '바이브 코딩', regionCode: 'JP', language: 'ja' },
    changeFilter: vi.fn(),
    changeSort: vi.fn(),
    changeViewFilter: vi.fn(),
    clearResults: vi.fn(),
    clearSelected: vi.fn(),
    displayedItems: [{
      channelId: 'channel-1', title: '아이디어 채널', customUrl: '@idea', description: '아이디어를 찾는 채널', country: 'KR', subscriberCount: 2000, hiddenSubscriberCount: false, totalVideoCount: 100, totalViewCount: 1000000, avgViewCount: 10000, url: 'https://www.youtube.com/channel/channel-1',
    }],
    error: '',
    filters: { query: '바이브 코딩', regionCode: '', language: '' },
    items: [{
      channelId: 'channel-1',
      title: '아이디어 채널',
      customUrl: '@idea',
      description: '아이디어를 찾는 채널',
      country: 'KR',
      subscriberCount: 2000,
      hiddenSubscriberCount: false,
      totalVideoCount: 100,
      totalViewCount: 1000000,
      avgViewCount: 10000,
      url: 'https://www.youtube.com/channel/channel-1',
    }],
    lastQuery: '바이브 코딩',
    loading: false,
    nextPageToken: 'next',
    notice: '1개 채널을 찾았습니다. 결과는 아직 등록되지 않았습니다.',
    runSearch: vi.fn(),
    resetViewFilters: vi.fn(),
    selectedIds: ['channel-1'],
    sortBy: 'relevance',
    toggleSelected: vi.fn(),
    viewFilters: { registration: 'all', country: 'all', selection: 'all' },
  })),
}));

import YoutubeChannelSearchPanel from './YoutubeChannelSearchPanel';

describe('YoutubeChannelSearchPanel', () => {
  it('separates temporary API results from registration and explains comparison metrics', () => {
    const html = renderToStaticMarkup(<YoutubeChannelSearchPanel onPrepareChannelRegistration={vi.fn()} />);
    expect(html).toContain('키워드로 YouTube 채널 찾기');
    expect(html).toContain('자동 등록하거나 Azure DB에 저장하지 않습니다');
    expect(html).toContain('비교 중 1개 / 최대 4개 채널');
    expect(html).toContain('비교 선택 전체 해제');
    expect(html).toContain('최근 성장률을 뜻하지 않습니다');
    expect(html).toContain('등록 검토하기');
    expect(html).toContain('다음 채널 12개 찾기');
    expect(html).toContain('채널의 운영 국가 제한이 아닙니다');
    expect(html).toContain('일본에서 시청 가능 · 일본어 우선');
    expect(html).toContain('대한민국·한국어 우선 빠른 설정');
    expect(html).toContain('검색 조건이 바뀌었습니다');
    expect(html).toContain('YouTube 관련도순');
    expect(html).toContain('구독자 많은순');
    expect(html).toContain('채널 설정 국가: 대한민국');
    expect(html).toContain('채널 운영자가 YouTube에 등록한 값이며 미등록일 수 있습니다');
    expect(html).toContain('현재 받은 채널 결과만 화면에서 정렬');
    expect(html).toContain('표시 결과 1개 / 받은 결과 1개');
    expect(html).toContain('미등록 채널만');
    expect(html).toContain('국가 미등록 채널만');
    expect(html).toContain('비교 선택만 보기');
    expect(html).toContain('화면 필터 초기화');
    expect(html).toContain('임시 결과 지우기');
    expect(html).toContain('검색 조건을 남기고 결과·비교 선택·화면 필터만 정리');
    expect(html).toContain('YouTube API나 Azure DB를 호출하지 않습니다');
  });

  it('marks a channel already present in the channel registry', () => {
    const html = renderToStaticMarkup(<YoutubeChannelSearchPanel registeredChannelIds={['channel-1']} onPrepareChannelRegistration={vi.fn()} />);
    expect(html).toContain('등록됨');
    expect(html).toContain('이미 등록된 채널');
  });
});
