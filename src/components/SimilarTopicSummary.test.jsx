import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SimilarTopicSummary from './SimilarTopicSummary';

describe('SimilarTopicSummary', () => {
  it('explains the local-only grouping boundary', () => {
    const html = renderToStaticMarkup(<SimilarTopicSummary groups={[
      { id: 'group-1', label: 'microsoft · copilot', count: 3 },
    ]} />);

    expect(html).toContain('비슷한 주제 1묶음');
    expect(html).toContain('microsoft · copilot · 3개');
    expect(html).toContain('AI·YouTube API·저장은 사용하지 않습니다');
    expect(html).toContain('원본 영상이나 저장 데이터는 합치지 않습니다');
  });

  it('does not render an empty summary', () => {
    expect(renderToStaticMarkup(<SimilarTopicSummary groups={[]} />)).toBe('');
  });

  it('renders selectable topic filters without implying a saved change', () => {
    const html = renderToStaticMarkup(<SimilarTopicSummary
      activeGroupId="group-1"
      groups={[{ id: 'group-1', label: 'excel · formula', count: 2 }]}
      onSelect={() => {}}
    />);

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('영상만 모아봅니다');
    expect(html).toContain('선택한 묶음만 표시 중');
    expect(html).toContain('저장 데이터는 바뀌지 않습니다');
  });
});
