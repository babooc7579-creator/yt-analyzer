import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_KANBAN_FILTER } from '../utils/productionKanbanFilters';
import ProductionKanbanSummaryMetrics from './ProductionKanbanSummaryMetrics';

describe('ProductionKanbanSummaryMetrics', () => {
  it('passes 온라인 저장소 기준 hover explanations to the metric cards', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryMetrics
        activeFilterMode={PRODUCTION_KANBAN_FILTER.CANDIDATE}
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

    expect(html).toContain('온라인 저장소(Azure DB)의 판단 기록에서 제작 후보 상태로 표시된 수집 영상 수입니다');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('온라인 발견함(Azure DB)에서 제작 후보로 표시한 링크 수입니다');
    expect(html).toContain('별도 제작 DB로 옮긴 값이 아닙니다');
    expect(html).toContain('권리 확인 필요 1개');
    expect((html.match(/<button/g) || []).length).toBe(4);
    expect(html).toContain('눌러 해당 단계만 표시합니다');
    expect(html).toContain('온라인 저장소(Azure DB) 데이터는 변경하지 않습니다');
    expect((html.match(/aria-pressed="true"/g) || []).length).toBe(1);
    expect(html).toContain('현재 보기');
  });

  it('connects each summary metric to its matching stage filter', () => {
    const onFilterModeChange = vi.fn();
    const view = ProductionKanbanSummaryMetrics({
      activeFilterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
      discoveryLinkCandidateCount: 1,
      onFilterModeChange,
      productionSummary: {
        activeCount: 1,
        candidateCount: 2,
        uploadedCount: 3,
      },
    });
    const metricCards = view.props.children[0];

    expect(metricCards.map((card) => card.props.selected)).toEqual([
      false,
      true,
      false,
      false,
    ]);

    metricCards.forEach((card) => card.props.onClick());

    expect(onFilterModeChange.mock.calls.map(([filterMode]) => filterMode)).toEqual([
      PRODUCTION_KANBAN_FILTER.CANDIDATE,
      PRODUCTION_KANBAN_FILTER.ACTIVE,
      PRODUCTION_KANBAN_FILTER.DONE,
      PRODUCTION_KANBAN_FILTER.LINKS,
    ]);
  });

  it('keeps the schedule summary full-width below the mobile metric grid', () => {
    const view = ProductionKanbanSummaryMetrics({
      activeFilterMode: PRODUCTION_KANBAN_FILTER.CANDIDATE,
      discoveryLinkCandidateCount: 0,
      productionSummary: {},
    });

    expect(view.props.className).toContain('grid-cols-2');
    expect(view.props.children[1].props.className).toContain('col-span-2');
    expect(view.props.children[1].props.className).toContain('md:col-span-1');
  });
});
