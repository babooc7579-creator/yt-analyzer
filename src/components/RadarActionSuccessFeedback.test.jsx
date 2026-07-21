import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarActionSuccessFeedback from './RadarActionSuccessFeedback';

describe('RadarActionSuccessFeedback', () => {
  it('explains the successful Cloud save and offers the next workspace', () => {
    const html = renderToStaticMarkup(
      <RadarActionSuccessFeedback
        title="제작 후보로 저장했습니다"
        message="다음 후보가 자동으로 표시됩니다."
        onDismiss={() => {}}
        onOpenProductionCandidates={() => {}}
      />,
    );

    expect(html).toContain('제작 후보로 저장했습니다');
    expect(html).toContain('다음 후보가 자동으로 표시됩니다.');
    expect(html).toContain('제작 후보함 열기');
    expect(html).toContain('YouTube API를 호출하지 않습니다.');
    expect(html).toContain('저장 완료 안내 닫기');
  });

  it('renders nothing without a message', () => {
    expect(renderToStaticMarkup(<RadarActionSuccessFeedback />)).toBe('');
  });
});
