import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarActionSuccessFeedback from './RadarActionSuccessFeedback';

describe('RadarActionSuccessFeedback', () => {
  it('explains the successful Cloud save and offers the next workspace', () => {
    const html = renderToStaticMarkup(
      <RadarActionSuccessFeedback
        actionLabel="제작 후보함 열기"
        actionTitle="Cloud 제작 후보함을 엽니다. YouTube API를 호출하지 않습니다."
        title="제작 후보로 저장했습니다"
        message="다음 후보가 자동으로 표시됩니다."
        onAction={() => {}}
        onDismiss={() => {}}
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

  it('offers the decision history after a status decision', () => {
    const html = renderToStaticMarkup(
      <RadarActionSuccessFeedback
        actionLabel="처리 기록 보기"
        actionTitle="처리 기록으로 이동합니다."
        title="봤음으로 정리했습니다"
        message="다음 후보가 자동으로 표시됩니다."
        onAction={() => {}}
        onDismiss={() => {}}
      />,
    );

    expect(html).toContain('봤음으로 정리했습니다');
    expect(html).toContain('처리 기록 보기');
    expect(html).not.toContain('제작 후보함 열기');
    expect(html).toContain('tabindex="-1"');
  });
});
