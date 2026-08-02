import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../hooks/useKeywordExplorerState', () => ({
  useKeywordExplorerState: vi.fn(() => ({
    ageFilter: 'all',
    displayedVideos: [],
    hasActiveFilters: false,
    hasQuery: false,
    lengthFilter: 'all',
    matchedVideos: [],
    minimumViews: 0,
    resetFilters: vi.fn(),
    searchQuery: '',
    setAgeFilter: vi.fn(),
    setLengthFilter: vi.fn(),
    setMinimumViews: vi.fn(),
    setSearchQuery: vi.fn(),
    setSortType: vi.fn(),
    sortType: 'relevance',
    suggestions: [{ label: 'cake', count: 3, channelCount: 2, reactionScore: 87 }],
    summary: {
      averageViews: 0,
      channelCount: 0,
      loadedVideoCount: 10,
      matchedVideoCount: 0,
      shownVideoCount: 0,
      strongestMultiplier: 0,
    },
  })),
}));

import { useKeywordExplorerState } from '../hooks/useKeywordExplorerState';
import KeywordExplorerWorkspace from './KeywordExplorerWorkspace';

describe('KeywordExplorerWorkspace', () => {
  it('renders a stored-data keyword workflow and recommendation chips', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace selectedChannelCount={2} videos={[]} />
    );

    expect(html).toContain('키워드로 수집 영상 찾기');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('수집 채널 반응도');
    expect(html).toContain('외부 검색량이나 완전한 실시간 지표가 아니며');
    expect(html).toContain('반응도 87');
    expect(html).toContain('cake');
    expect(html).toContain('외부 관심도 확인');
    expect(html).toContain('외부 검색량을 자동 수집하지 않습니다');
    expect(html).toContain('업무 도구함 전체 보기');
    expect(html).toContain('찾고 싶은 소재 키워드를 입력하세요');
  });

  it('disables duplicate stored-video lookup while Cloud data is loading', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace loading selectedChannelCount={2} videos={[]} />
    );

    expect(html).toContain('수집 영상 불러오는 중...');
    expect(html).toContain('disabled');
  });

  it('guides the user to retry when the Cloud lookup fails', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace
        loadResult={{ success: false, videoCount: 0 }}
        onLoadStoredVideos={vi.fn()}
        selectedChannelCount={2}
        videos={[]}
      />
    );

    expect(html).toContain('온라인 저장소(Azure DB)의 수집 영상 정보를 불러오지 못했습니다');
    expect(html).toContain('온라인 저장소(Azure DB)의 수집 영상 정보 다시 불러오기');
    expect(html).toContain('YouTube API를 호출하지 않았습니다');
  });

  it('offers channel selection and collection preparation after a successful empty lookup', () => {
    useKeywordExplorerState.mockReturnValueOnce({
      ageFilter: 'all',
      displayedVideos: [],
      hasActiveFilters: false,
      hasQuery: false,
      lengthFilter: 'all',
      minimumViews: 0,
      resetFilters: vi.fn(),
      searchQuery: '',
      setAgeFilter: vi.fn(),
      setLengthFilter: vi.fn(),
      setMinimumViews: vi.fn(),
      setSearchQuery: vi.fn(),
      setSortType: vi.fn(),
      sortType: 'relevance',
      suggestions: [],
      summary: {
        averageViews: 0,
        channelCount: 0,
        loadedVideoCount: 0,
        matchedVideoCount: 0,
        shownVideoCount: 0,
        strongestMultiplier: 0,
      },
    });

    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace
        loadResult={{ success: true, videoCount: 0 }}
        onLoadStoredVideos={vi.fn()}
        onOpenChannelWatchlist={vi.fn()}
        onOpenSelectedScan={vi.fn()}
        selectedChannelCount={2}
        videos={[]}
      />
    );

    expect(html).toContain('조회는 정상 완료됐지만 수집된 영상 정보가 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 화면 열기');
    expect(html).toContain('이동만으로 YouTube API를 호출하지 않습니다');
  });

  it('restores temporary YouTube video results after returning from another workspace', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace
        keywordExplorerSession={{
          source: 'youtube',
          searchTarget: 'video',
          videoSearch: {
            filters: {
              query: '바이브 코딩',
              regionCode: '',
              language: '',
              dateRange: '30',
              duration: '',
              minimumViews: 0,
              order: 'relevance',
            },
            items: [{
              videoId: 'video-restored',
              channelId: 'channel-restored',
              channelTitle: '복귀 확인 채널',
              title: '다시 검색하지 않아도 남아 있는 영상',
              url: 'https://www.youtube.com/watch?v=video-restored',
              publishedAt: '2026-08-02T00:00:00Z',
              duration: '08:03',
              viewCount: 1000,
              subscriberCount: 500,
              hiddenSubscriberCount: false,
              viralRatio: 200,
              lifetimeViewsPerDay: 100,
            }],
            lastQuery: '바이브 코딩',
            nextPageToken: '',
            notice: '25개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.',
            selectedIds: [],
          },
        }}
        selectedChannelCount={2}
        videos={[]}
      />
    );

    expect(html).toContain('키워드로 YouTube 영상 찾기');
    expect(html).toContain('다시 검색하지 않아도 남아 있는 영상');
    expect(html).toContain('25개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.');
  });
});
