import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_KANBAN_FILTER } from '../utils/productionKanbanFilters';
import ProductionKanbanSummaryMetrics from './ProductionKanbanSummaryMetrics';

describe('ProductionKanbanSummaryMetrics', () => {
  it('passes Cloud 기준 hover explanations to the metric cards', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryMetrics
        discoveryLinkCandidateCount={2}
        onFilterModeChange={() => {}}
        productionSummary={{
          activeCount: 1,
          candidateCount: 3,
          discoveryRightsWarningCount: 1,
          uploadedCount: 4,
        }}
      />,
    );

    expect(html).toContain('Cloud 판단 기록에서 제작 후보 상태로 표시된 저장 영상 수입니다');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('Cloud 발견함에서 제작 후보로 표시한 링크 수입니다');
    expect(html).toContain('별도 제작 DB로 옮긴 값이 아닙니다');
    expect(html).toContain('권리 확인 필요 1개');
    expect((html.match(/<button/g) || []).length).toBe(4);
    expect(html).toContain('눌러 해당 단계만 표시합니다');
    expect(html).toContain('Cloud 데이터는 변경하지 않습니다');
  });

  it('connects each summary metric to its matching stage filter', () => {
    const onFilterModeChange = vi.fn();
    const view = ProductionKanbanSummaryMetrics({
      discoveryLinkCandidateCount: 1,
      onFilterModeChange,
      productionSummary: {
        activeCount: 1,
        candidateCount: 2,
        uploadedCount: 3,
      },
    });
    const metricCards = view.props.children[0];

    metricCards.forEach((card) => card.props.onClick());

    expect(onFilterModeChange.mock.calls.map(([filterMode]) => filterMode)).toEqual([
      PRODUCTION_KANBAN_FILTER.CANDIDATE,
      PRODUCTION_KANBAN_FILTER.ACTIVE,
      PRODUCTION_KANBAN_FILTER.DONE,
      PRODUCTION_KANBAN_FILTER.LINKS,
    ]);
  });
});
