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

    expect(html).toContain('이번 목록 3/12개 판단');
    expect(html).toContain('width:25%');
  });
});
