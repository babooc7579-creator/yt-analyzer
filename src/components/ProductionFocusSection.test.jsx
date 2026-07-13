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
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
  });
});
