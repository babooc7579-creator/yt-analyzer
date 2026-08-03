import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoCardStatusBadges from './VideoCardStatusBadges';

describe('VideoCardStatusBadges', () => {
  it('renders saved, production candidate, and AI prompt badges with clear titles', () => {
    const html = renderToStaticMarkup(
      <VideoCardStatusBadges
        isChecked
        isProductionCandidate
        isSaved
        similarTopicCount={3}
      />,
    );

    expect(html).toContain('소재 보관');
    expect(html).toContain('온라인 저장소(Azure DB)의 소재 보관함에 보관된 영상입니다. 제작 후보 여부와는 별도입니다.');
    expect(html).toContain('제작 후보');
    expect(html).toContain('온라인 저장소(Azure DB)의 판단 기록에서 제작 후보로 표시된 영상입니다. 제작 후보함에 표시됩니다.');
    expect(html).toContain('AI 요청문 선택');
    expect(html).toContain('AI 요청문에 포함할 영상으로 화면에서 선택한 상태입니다.');
    expect(html).toContain('비슷한 주제 3개');
    expect(html).toContain('AI 분석이나 저장 데이터 통합은 아닙니다.');
  });

  it('does not render hidden status badges', () => {
    const html = renderToStaticMarkup(
      <VideoCardStatusBadges
        isChecked={false}
        isProductionCandidate={false}
        isSaved={false}
      />,
    );

    expect(html).not.toContain('소재 보관');
    expect(html).not.toContain('제작 후보');
    expect(html).not.toContain('AI 요청문 선택');
  });
});
