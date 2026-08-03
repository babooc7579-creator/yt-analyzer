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
});
