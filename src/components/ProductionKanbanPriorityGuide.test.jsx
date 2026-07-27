import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_KANBAN_FILTER } from '../utils/productionKanbanFilters';
import ProductionKanbanPriorityGuide from './ProductionKanbanPriorityGuide';

const findElementByType = (node, type) => {
  if (!node || typeof node !== 'object') return null;
  if (node.type === type) return node;

  const children = Array.isArray(node.props?.children)
    ? node.props.children
    : [node.props?.children];

  for (const child of children) {
    const match = findElementByType(child, type);
    if (match) return match;
  }

  return null;
};

describe('ProductionKanbanPriorityGuide', () => {
  it('renders a display-only next priority guide for production candidates', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={2}
        onFilterModeChange={() => {}}
        onOpenUploadCalendar={() => {}}
        productionSummary={{
          activeWithoutDate: 1,
          candidateCount: 3,
        }}
      />,
    );

    expect(html).toContain('일정 미정');
    expect(html).toContain('제작 중인 후보에 업로드 예정일을 붙이세요');
    expect(html).toContain('오늘 순서');
    expect(html).toContain('업로드 예정일 입력');
    expect(html).toContain('표시 전용 안내입니다');
    expect(html).toContain('YouTube API 호출');
    expect(html).toContain('온라인 저장소(Azure DB) 저장은 실행하지 않습니다');
    expect(html).toContain('일정 없는 제작 중 보기');
    expect(html).toContain('해당하는 제작 단계만 표시합니다');
  });

  it('prioritizes a manually pinned focus video before unpinned candidates', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={0}
        onFilterModeChange={() => {}}
        productionSummary={{
          activeCount: 0,
          candidateCount: 3,
          focusCount: 1,
        }}
      />,
    );

    expect(html).toContain('오늘 집중');
    expect(html).toContain('직접 고정한 영상부터 제작 여부를 확정하세요');
    expect(html).toContain('첫 번째 고정 영상 확인');
    expect(html).toContain('오늘 집중 작업 보기');
  });

  it('connects overdue work to the upload calendar without changing data', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={0}
        onOpenUploadCalendar={() => {}}
        productionSummary={{
          overdueCount: 1,
        }}
      />,
    );

    expect(html).toContain('업로드 일정 열기');
    expect(html).toContain('업로드 캘린더로 이동합니다');
    expect(html).toContain('온라인 저장소(Azure DB) 데이터나 YouTube API 호출은 실행되지 않습니다');
  });

  it('applies the recommended stage filter when its action is clicked', () => {
    const onFilterModeChange = vi.fn();
    const view = ProductionKanbanPriorityGuide({
      discoveryLinkCandidateCount: 0,
      onFilterModeChange,
      productionSummary: { activeCount: 2 },
    });
    const actionButton = findElementByType(view, 'button');

    actionButton.props.onClick();

    expect(onFilterModeChange).toHaveBeenCalledWith(PRODUCTION_KANBAN_FILTER.ACTIVE);
  });

  it('opens the upload calendar for overdue work', () => {
    const onOpenUploadCalendar = vi.fn();
    const view = ProductionKanbanPriorityGuide({
      discoveryLinkCandidateCount: 0,
      onOpenUploadCalendar,
      productionSummary: { overdueCount: 1 },
    });
    const actionButton = findElementByType(view, 'button');

    actionButton.props.onClick();

    expect(onOpenUploadCalendar).toHaveBeenCalledOnce();
  });
});
