import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoToolbarQuickFilters from './VideoToolbarQuickFilters';

describe('VideoToolbarQuickFilters', () => {
  it('shows three screen-only quick views with mobile-safe controls', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarQuickFilters
        quickFilter="recent30"
        quickFilterCounts={{ recent30: 11, oldPopular: 12, ttoTto: 29 }}
        setQuickFilter={() => {}}
        setSortType={() => {}}
        setTtoTtoMode={() => {}}
        ttoTtoMode={false}
      />,
    );

    expect(html).toContain('수집 영상 빠른 필터');
    expect(html).toContain('최근 30일');
    expect(html).toContain('오래된 인기');
    expect(html).toContain('또터또 발굴');
    expect(html).toContain('최근 30일 대상 11개');
    expect(html).toContain('오래된 인기 대상 12개');
    expect(html).toContain('또터또 대상 29개');
    expect(html).toContain('YouTube API 호출 없음');
    expect(html).toContain('w-full');
    expect(html).toContain('sm:w-auto');
  });

  it('shows lookup-before instead of a false zero before Azure DB lookup', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarQuickFilters
        quickFilter="all"
        quickFilterCounts={{ recent30: null, oldPopular: null, ttoTto: null }}
        setQuickFilter={() => {}}
        setSortType={() => {}}
        setTtoTtoMode={() => {}}
        ttoTtoMode={false}
      />,
    );

    expect(html).toContain('최근 30일 대상 조회 전');
    expect(html).toContain('또터또 대상 조회 전');
  });
});
