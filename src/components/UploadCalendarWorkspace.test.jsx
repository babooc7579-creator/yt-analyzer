import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import UploadCalendarWorkspace from './UploadCalendarWorkspace';

describe('UploadCalendarWorkspace', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders saved schedule records as an operational calendar', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarWorkspace
        onOpenProductionCandidate={vi.fn()}
        onOpenProductionCandidates={vi.fn()}
        onOpenScriptBoard={vi.fn()}
        videoUserRecords={{
          v1: { status: PRODUCTION_STATUS.ACTIVE, statusIds: [PRODUCTION_STATUS.ACTIVE], targetPublishDate: '2026-07-14' },
        }}
        videos={[{ videoId: 'v1', title: '예약 영상' }]}
      />,
    );

    expect(html).toContain('업로드 캘린더');
    expect(html).toContain('제작 후보함에서 일정 수정');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
    expect(html).toContain('대본 보드 열기');
    expect(html).toContain('후보함에서 찾기');
    expect(html).toContain('제작 후보함에서 일정 수정, 화면 이동이며 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음');
    expect(html).toContain('오늘이 포함된 달 보기, 화면 표시만 변경');
  });

  it('opens the date and highlights the video carried from the script board', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarWorkspace
        initialTargetPublishDate="2026-08-04"
        initialTargetVideoId="v2"
        videoUserRecords={{
          v2: { status: PRODUCTION_STATUS.CANDIDATE, statusIds: [PRODUCTION_STATUS.CANDIDATE], targetPublishDate: '2026-08-04' },
        }}
        videos={[{ videoId: 'v2', title: '대본에서 이어온 영상' }]}
      />,
    );

    expect(html).toContain('2026년 8월');
    expect(html).toContain('2026-08-04 · 1개');
    expect(html).toContain('대본에서 이어온 영상');
    expect(html).toContain('이어서 작업');
  });
});
