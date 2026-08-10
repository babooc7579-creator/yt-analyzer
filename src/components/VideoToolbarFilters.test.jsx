import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoToolbarFilters from './VideoToolbarFilters';

describe('VideoToolbarFilters', () => {
  it('groups mobile filters by task and lets the search field use the available width', () => {
    const noop = vi.fn();
    const html = renderToStaticMarkup(
      <VideoToolbarFilters
        lengthFilter="all"
        onResetFilters={noop}
        quickFilter="all"
        searchKeyword=""
        selectedVideoCount={0}
        setLengthFilter={noop}
        setQuickFilter={noop}
        setSearchKeyword={noop}
        setShowWorkPanel={noop}
        setSortType={noop}
        setViewFilter={noop}
        setViewMode={noop}
        showWorkPanel={false}
        sortType="recommended"
        ttoTtoMode={false}
        viewFilter={0}
        viewMode="card"
      />,
    );

    expect(html).toContain('수집 영상 기본 필터');
    expect(html).toContain('수집 영상 정렬');
    expect(html).toContain('수집 영상 보기와 선택 상태');
    expect(html).toContain('sm:grid-cols-[minmax(14rem,1fr)_auto_auto]');
    expect(html).toContain('relative w-full min-w-0');
    expect(html).not.toContain('w-56');
  });
});
