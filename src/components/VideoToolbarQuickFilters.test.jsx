import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoToolbarQuickFilters from './VideoToolbarQuickFilters';

describe('VideoToolbarQuickFilters', () => {
  it('shows three screen-only quick views with mobile-safe controls', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarQuickFilters
        quickFilter="recent30"
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
    expect(html).toContain('YouTube API 호출 없음');
    expect(html).toContain('w-full');
    expect(html).toContain('sm:w-auto');
  });
});
