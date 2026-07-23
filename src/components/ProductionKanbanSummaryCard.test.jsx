import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanSummaryCard from './ProductionKanbanSummaryCard';

describe('ProductionKanbanSummaryCard', () => {
  it('renders the metric title as a hover explanation', () => {
    const title = 'Cloud 판단 기록에서 제작 후보 상태로 표시된 저장 영상 수입니다. YouTube API를 새로 호출하지 않습니다.';

    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryCard
        label="제작 후보"
        labelClassName="label-class"
        title={title}
        value="3개"
        valueClassName="value-class"
        wrapperClassName="wrapper-class"
      >
        <span>권리 확인 필요 1개</span>
      </ProductionKanbanSummaryCard>,
    );

    expect(html).toContain(`title="${title}"`);
    expect(html).toContain('제작 후보');
    expect(html).toContain('3개');
    expect(html).toContain('권리 확인 필요 1개');
  });

  it('renders a metric as a filter button when a click handler is provided', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryCard
        label="제작 중"
        labelClassName="label-class"
        onClick={() => {}}
        title="제작 중 단계만 표시합니다."
        value="2개"
        valueClassName="value-class"
        wrapperClassName="wrapper-class"
      />,
    );

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('제작 중 단계만 표시합니다.');
    expect(html).toContain('2개');
  });

  it('marks the selected metric as the current view', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanSummaryCard
        label="제작 후보"
        labelClassName="label-class"
        onClick={() => {}}
        selected
        title="제작 후보만 표시합니다."
        value="3개"
        valueClassName="value-class"
        wrapperClassName="wrapper-class"
      />,
    );

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('현재 보기');
    expect(html).toContain('ring-indigo-500');
  });
});
