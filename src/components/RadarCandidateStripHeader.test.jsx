import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarCandidateStripHeader from './RadarCandidateStripHeader';

describe('RadarCandidateStripHeader', () => {
  it('renders the real progress for the current loaded list', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateStripHeader
        allDecisionCount={3}
        loadedDecisionCount={3}
        queueSummary={{
          candidateLimit: 6,
          hiddenDecisionCount: 3,
          highPriorityCount: 2,
          shownCandidateCount: 6,
          visibleQueueCount: 9,
        }}
        savedVideoCount={1}
      />,
    );

    expect(html).toContain('3개 완료 · 9개 남음');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('width:25%');
    expect(html).not.toContain('판단 초기화');
  });
});
