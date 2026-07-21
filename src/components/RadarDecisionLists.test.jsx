import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarDecisionLists from './RadarDecisionLists';

describe('RadarDecisionLists', () => {
  it('provides a focusable destination for success feedback recovery', () => {
    const html = renderToStaticMarkup(
      <RadarDecisionLists
        groups={[{
          key: 'reviewed',
          label: '봤음',
          videos: [{ videoId: 'video-1', title: '확인한 영상' }],
        }]}
        loadedDecisionCount={1}
        onRestoreVideo={() => {}}
      />,
    );

    expect(html).toContain('id="today-radar-decision-history"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('레이더로 되돌리기');
  });
});
