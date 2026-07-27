import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionFocusSection from './ProductionFocusSection';

describe('ProductionFocusSection', () => {
  const baseProps = {
    draftRecords: {},
    getScheduleSignal: () => ({ label: '일정 미정', tone: 'bg-slate-100 text-slate-600' }),
    hasUnsavedChanges: () => false,
    moveStates: {},
    onFocus: () => 'focus',
    onMove: () => 'move',
    onOpenUploadCalendar: () => 'calendar',
    onSave: () => 'save',
    onUpdateDraft: () => 'update',
    saveStates: {},
    videoUserRecords: {},
  };

  it('renders the empty manual focus state', () => {
    const html = renderToStaticMarkup(
      <ProductionFocusSection {...baseProps} videos={[]} />,
    );

    expect(html).toContain('오늘 집중');
    expect(html).toContain('날짜가 바뀌어도 자동으로 사라지지 않습니다');
    expect(html).toContain('아직 오늘 집중으로 고정한 영상이 없습니다');
    expect(html).toContain('href="#production-kanban-board"');
    expect(html).toContain('제작 후보에서 고르기');
    expect(html).toContain('이동만으로 온라인 저장소(Azure DB) 데이터는 변경되지 않습니다');
  });

  it('renders focused video cards with release and production actions', () => {
    const html = renderToStaticMarkup(
      <ProductionFocusSection
        {...baseProps}
        videoUserRecords={{
          'video-1': {
            focusPinnedAt: '2026-07-13T09:00:00.000Z',
            status: 'production_candidate',
            statusIds: ['production_candidate'],
          },
        }}
        videos={[{
          videoId: 'video-1',
          title: '오늘 만들 영상',
          multiplier: 12,
        }]}
      />,
    );

    expect(html).toContain('오늘 만들 영상');
    expect(html).toContain('집중 해제');
    expect(html).toContain('제작 중으로');
    expect(html).toContain('일정 정하기');
    expect(html).toContain('오늘 집중 후보 업로드 일정 정하기');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('keeps multiple focused candidates and long titles inside a stable responsive grid', () => {
    const firstTitle = '매우 긴 제목도 두 줄 안에서 안정적으로 표시되어야 하는 오늘의 첫 번째 제작 후보 영상';
    const secondTitle = '두 번째 오늘 집중 후보 역시 함께 표시되고 버튼 저장 중에는 중복 요청을 막아야 합니다';
    const html = renderToStaticMarkup(
      <ProductionFocusSection
        {...baseProps}
        moveStates={{ 'video-1': 'saving' }}
        videoUserRecords={{
          'video-1': { focusPinnedAt: '2026-07-13T09:00:00.000Z', statusIds: ['production_candidate'] },
          'video-2': { focusPinnedAt: '2026-07-13T10:00:00.000Z', statusIds: ['production_candidate'] },
        }}
        videos={[
          { videoId: 'video-1', title: firstTitle },
          { videoId: 'video-2', title: secondTitle },
        ]}
      />,
    );

    expect(html).toContain('aria-label="오늘 집중 영상 2개"');
    expect(html).toContain('sm:flex-row');
    expect(html).toContain('grid-cols-1');
    expect(html).toContain('xl:grid-cols-2');
    expect(html).toContain(firstTitle);
    expect(html).toContain(secondTitle);
    expect(html).toContain('변경 중...');
    expect(html).toContain('disabled=""');
  });
});
