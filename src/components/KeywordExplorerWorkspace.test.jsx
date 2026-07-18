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
    suggestions: [{ label: 'cake', count: 3 }],
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

import KeywordExplorerWorkspace from './KeywordExplorerWorkspace';

describe('KeywordExplorerWorkspace', () => {
  it('renders a stored-data keyword workflow and recommendation chips', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace selectedChannelCount={2} videos={[]} />
    );

    expect(html).toContain('키워드 탐색');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('제목 추천어');
    expect(html).toContain('cake');
    expect(html).toContain('찾고 싶은 소재 키워드를 입력하세요');
  });

  it('disables duplicate stored-video lookup while Cloud data is loading', () => {
    const html = renderToStaticMarkup(
      <KeywordExplorerWorkspace loading selectedChannelCount={2} videos={[]} />
    );

    expect(html).toContain('저장 영상 불러오는 중...');
    expect(html).toContain('disabled');
  });
});
