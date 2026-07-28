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
    expect(html).toContain('오늘 후보 판정 영역으로 이동, 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음');
  });

  it('opens the production workflow after a candidate is chosen', () => {
    const html = renderToStaticMarkup(
      <HomeRadarFinishStage
        onOpenScriptBoard={() => {}}
        onOpenUploadCalendar={() => {}}
        productionCandidateCount={2}
        productionFocusCount={1}
      />,
    );

    expect(html).toContain('제작 후보 2개가 준비됐습니다');
    expect(html).toContain('현재 오늘 집중 1개');
    expect(html).toContain('오늘 집중 계속하기');
    expect(html).toContain('대본 작업 시작');
    expect(html).toContain('업로드 일정 정하기');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
    expect(html).toContain('제작 후보함으로 이동, 후보 상태 변경 및 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음');
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
    expect(html).toContain('오늘 집중 정하기');
    expect(html).toContain('제작 후보의 목표 업로드 날짜를 정하거나 확인합니다');
    expect(html).not.toContain('현재 오늘 집중');
  });
});
