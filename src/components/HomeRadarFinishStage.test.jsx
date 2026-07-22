import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeRadarFinishStage from './HomeRadarFinishStage';

describe('HomeRadarFinishStage', () => {
  it('guides an undecided user back to the candidate cards', () => {
    const html = renderToStaticMarkup(<HomeRadarFinishStage />);

    expect(html).toContain('STAGE 4');
    expect(html).toContain('id="today-radar-finish"');
    expect(html).toContain('오늘 만들 한 가지');
    expect(html).toContain('후보 판정대로 이동');
  });

  it('opens the production workflow after a candidate is chosen', () => {
    const html = renderToStaticMarkup(
      <HomeRadarFinishStage
        onOpenUploadCalendar={() => {}}
        productionCandidateCount={2}
        productionFocusCount={1}
      />,
    );

    expect(html).toContain('제작 후보 2개가 준비됐습니다');
    expect(html).toContain('현재 오늘 집중 1개');
    expect(html).toContain('제작 후보함에서 이어가기');
    expect(html).toContain('업로드 일정 정하기');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
  });

  it('keeps the upload calendar available before a candidate is pinned for today', () => {
    const html = renderToStaticMarkup(
      <HomeRadarFinishStage
        onOpenProductionCandidates={() => {}}
        onOpenUploadCalendar={() => {}}
        productionCandidateCount={1}
        productionFocusCount={0}
      />,
    );

    expect(html).toContain('업로드 일정 정하기');
    expect(html).toContain('제작 후보의 목표 업로드 날짜를 정하거나 확인합니다');
    expect(html).not.toContain('현재 오늘 집중');
  });
});
