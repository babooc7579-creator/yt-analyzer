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
            scriptAnalysis: '원본의 반전이 핵심',
            scriptBody: '최종 대본 본문',
            scriptOutline: '도입 → 전개 → 결론',
            scriptStatus: 'revision',
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
    expect(html).toContain('AI 없이 작성하는 대본 작업 기준');
    expect(html).toContain('오래된 정보·정책·가격을 다시 확인할 항목');
    expect(html).toContain('도입 훅 → 문제 → 핵심 정보·사례 → 전환 → 결론 순서');
    expect(html).toContain('원본 표현과 지나치게 비슷한 문장 제거');
    expect(html).toContain('AI 요청은 실행되지 않습니다');
    expect(html).toContain('내가 만들 제목');
    expect(html).toContain('대본 진행 단계');
    expect(html).toContain('수정 중');
    expect(html).toContain('1. 영상 분석');
    expect(html).toContain('2. 대본 구성안');
    expect(html).toContain('3. 대본 본문');
    expect(html).toContain('기존 통합 작업 메모');
    expect(html).toContain('기존 자료 보존');
    expect(html).toContain('첫 3초 훅');
    expect(html).toContain('원본의 반전이 핵심');
    expect(html).toContain('도입 → 전개 → 결론');
    expect(html).toContain('최종 대본 본문');
    expect(html).toContain('대본 작업 준비 완료');
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
