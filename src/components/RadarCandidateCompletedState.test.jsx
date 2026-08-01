import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import RadarCandidateCompletedState from './RadarCandidateCompletedState';

describe('RadarCandidateCompletedState', () => {
  it('does not expose the full-record clear action', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateCompletedState
        decisionGroups={[]}
        decisionSummary={{}}
        loadedDecisionCount={0}
        onClearDecisions={vi.fn()}
        onOpenVault={vi.fn()}
        onRestoreVideo={vi.fn()}
      />,
    );

    expect(html).toContain('수집 영상 목록 열기');
    expect(html).not.toContain('판단 기록 초기화');
    expect(html).not.toContain('초기화 중');
  });
});
