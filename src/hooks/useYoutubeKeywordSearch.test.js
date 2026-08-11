import { beforeEach, describe, expect, it, vi } from 'vitest';

const { searchYoutubeVideosMock, stateSetters } = vi.hoisted(() => ({
  searchYoutubeVideosMock: vi.fn(),
  stateSetters: [],
}));

vi.mock('react', () => ({
  useEffect: vi.fn(),
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [typeof initialValue === 'function' ? initialValue() : initialValue, setter];
  }),
}));

vi.mock('../services/youtubeSearchApi', () => ({
  searchYoutubeVideos: searchYoutubeVideosMock,
}));

import { useYoutubeKeywordSearch } from './useYoutubeKeywordSearch';

describe('useYoutubeKeywordSearch', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
    searchYoutubeVideosMock.mockResolvedValue({
      success: true,
      items: [],
      nextPageToken: '',
    });
  });

  it('reuses the first API criteria and fixed date boundary for the next page', async () => {
    const appliedFilters = {
      query: 'copilot',
      regionCode: 'KR',
      language: 'ko',
      dateRange: '30',
      duration: 'medium',
      minimumViews: 0,
      order: 'relevance',
      publishedAfter: '2026-07-12T03:00:00.000Z',
    };
    const search = useYoutubeKeywordSearch({
      initialState: {
        appliedFilters,
        filters: appliedFilters,
        nextPageToken: 'next-page',
      },
    });

    await search.runSearch({ append: true });

    expect(searchYoutubeVideosMock).toHaveBeenCalledWith(expect.objectContaining({
      q: 'copilot',
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      videoDuration: 'medium',
      pageToken: 'next-page',
      publishedAfter: '2026-07-12T03:00:00.000Z',
    }));
  });

  it('stores the calculated date boundary with the first applied criteria', async () => {
    const search = useYoutubeKeywordSearch({
      initialState: {
        filters: { query: 'copilot', dateRange: '30' },
      },
    });

    await search.runSearch();

    expect(stateSetters[8]).toHaveBeenCalledWith(expect.objectContaining({
      query: 'copilot',
      dateRange: '30',
      publishedAfter: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    }));
  });
});
