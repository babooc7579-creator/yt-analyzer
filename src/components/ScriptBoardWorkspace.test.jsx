import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import ScriptBoardWorkspace from './ScriptBoardWorkspace';

describe('ScriptBoardWorkspace', () => {
  it('renders a focused Cloud writing desk for production candidates', () => {
    const html = renderToStaticMarkup(
      <ScriptBoardWorkspace
        onOpenHome={vi.fn()}
        onOpenProductionCandidates={vi.fn()}
        onOpenUploadCalendar={vi.fn()}
        onUpdateVideoRecord={vi.fn()}
        videoUserRecords={{
          v1: {
            status: PRODUCTION_STATUS.CANDIDATE,
            draftTitle: '내가 만들 제목',
            note: '첫 3초 훅',
            targetPublishDate: '2026-08-01',
          },
        }}
        videos={[{
          videoId: 'v1',
          title: '원본 영상 제목',
          channel_title: '테스트 채널',
        }]}
      />,
    );

    expect(html).toContain('대본 분석·작성·수정 작업');
    expect(html).toContain('현재 지원 범위');
    expect(html).toContain('개선 기록');
    expect(html).toContain('기존 온라인 저장소(Azure DB)의 제작 기록');
    expect(html).toContain('새 YouTube API 호출은 없습니다');
    expect(html).toContain('내가 만들 제목');
    expect(html).toContain('작업 메모 · 대본 초안');
    expect(html).toContain('현재 통합 입력');
    expect(html).toContain('첫 3초 훅');
    expect(html).toContain('업로드 캘린더 보기');
    expect(html).toContain('변경사항 저장');
    expect(html).toContain('href="https://youtube.com/watch?v=v1"');
    expect(html).toContain('원본 영상 제목 YouTube 원본 URL 복사');
  });

  it('renders a clear source action when no production candidate exists', () => {
    const html = renderToStaticMarkup(
      <ScriptBoardWorkspace
        onOpenProductionCandidates={vi.fn()}
        onUpdateVideoRecord={vi.fn()}
        videoUserRecords={{}}
        videos={[]}
      />,
    );

    expect(html).toContain('아직 작성할 제작 후보가 없습니다');
    expect(html).toContain('제작 후보 고르기');
    expect(html).toContain('화면 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 없습니다');
  });
});
