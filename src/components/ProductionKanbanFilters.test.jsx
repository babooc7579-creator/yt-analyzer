import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanFilteredEmptyState from './ProductionKanbanFilteredEmptyState';
import ProductionKanbanFilters from './ProductionKanbanFilters';

const noop = () => {};

describe('ProductionKanbanFilters', () => {
  it('renders search, stage options, and a no-API explanation', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: false, metricText: '작업 항목 5개' }}
        onFilterModeChange={noop}
        onReset={noop}
        onSearchQueryChange={noop}
        searchQuery=""
      />,
    );

    expect(html).toContain('제작 작업 찾기');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('영상 제목, 채널, 내 제목, 메모 검색');
    expect(html).toContain('오늘 집중');
    expect(html).toContain('발견 링크');
    expect(html).toContain('작업 항목 5개');
  });

  it('renders a reset action when filters have no result', () => {
    const html = renderToStaticMarkup(<ProductionKanbanFilteredEmptyState onReset={noop} />);

    expect(html).toContain('조건에 맞는 제작 작업이 없습니다');
    expect(html).toContain('전체 작업 보기');
  });
});
