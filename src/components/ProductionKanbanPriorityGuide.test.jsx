import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanPriorityGuide from './ProductionKanbanPriorityGuide';

describe('ProductionKanbanPriorityGuide', () => {
  it('renders a display-only next priority guide for production candidates', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={2}
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
    expect(html).toContain('Cloud 저장은 실행하지 않습니다');
  });

  it('prioritizes a manually pinned focus video before unpinned candidates', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={0}
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
  });
});
