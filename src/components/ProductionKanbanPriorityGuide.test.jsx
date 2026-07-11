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
    expect(html).toContain('표시 전용 안내입니다');
    expect(html).toContain('YouTube API 호출');
    expect(html).toContain('Cloud 저장은 실행하지 않습니다');
  });
});
