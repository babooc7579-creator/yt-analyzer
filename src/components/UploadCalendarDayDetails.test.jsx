import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import UploadCalendarDayDetails from './UploadCalendarDayDetails';

const longTitle = '아주 긴 제작 후보 제목이 모바일 화면에서도 카드 밖으로 밀려나지 않고 두 줄 안에서 안전하게 표시되어야 하는 일정 영상';

describe('UploadCalendarDayDetails', () => {
  it('renders long schedule titles with a stable clamped layout and safe actions', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarDayDetails
        focusedVideoId="video-1"
        items={[{
          date: '2026-07-14',
          sourceLoaded: true,
          statusLabel: '제작 중',
          title: longTitle,
          videoId: 'video-1',
        }]}
        onOpenProductionCandidate={() => {}}
        onOpenProductionCandidates={() => {}}
        onOpenScriptBoard={() => {}}
        selectedDate="2026-07-14"
      />,
    );

    expect(html).toContain(longTitle);
    expect(html).toContain('line-clamp-2');
    expect(html).toContain('대본 작업실 열기');
    expect(html).toContain('후보함에서 찾기');
    expect(html).toContain('원본 열기');
    expect(html).toContain('온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음');
    expect(html).toContain('이어서 작업');
    expect(html).toContain('border-amber-300');
  });

  it('omits unavailable workspace navigation buttons', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarDayDetails
        items={[{ date: '2026-07-14', statusLabel: '제작 후보', title: '일정 후보', videoId: 'video-1' }]}
        onOpenProductionCandidates={() => {}}
        selectedDate="2026-07-14"
      />,
    );

    expect(html).not.toContain('대본 작업실 열기');
    expect(html).not.toContain('후보함에서 찾기');
    expect(html).toContain('원본 열기');
  });

  it('offers a direct next action when the selected date has no schedule', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarDayDetails
        items={[]}
        onOpenProductionCandidates={() => {}}
        selectedDate="2026-07-15"
      />,
    );

    expect(html).toContain('선택한 날짜에 등록된 일정이 없습니다.');
    expect(html).toContain('제작 후보함에서 후보를 고르고 목표 업로드 날짜를 지정하세요.');
    expect(html).toContain('제작 후보에서 날짜 정하기');
  });
});
