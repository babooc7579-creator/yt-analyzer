import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanSummaryMetrics from './ProductionKanbanSummaryMetrics';

describe('ProductionKanbanSummaryMetrics', () => {
  it('passes Cloud 기준 hover explanations to the metric cards', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryMetrics
        discoveryLinkCandidateCount={2}
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
  });
});
