import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoToolbarFilterStatus from './VideoToolbarFilterStatus';

describe('VideoToolbarFilterStatus', () => {
  it('keeps the current selection visible and offers a no-API filter reset', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarFilterStatus
        activeFilterCount={2}
        activeFilterLabels={['최근 30일', '쇼츠만']}
        onResetFilters={vi.fn()}
        selectedVideoCount={3}
      />,
    );

    expect(html).toContain('화면 선택 3개');
    expect(html).toContain('필터 2개 적용 · 최근 30일 · 쇼츠만');
    expect(html).toContain('필터 초기화');
    expect(html).toContain('영상 선택 유지, API 호출 없음');
    expect(html).toContain('flex min-w-0 max-w-full flex-wrap');
    expect(html).toContain('min-w-0 max-w-full break-words');
  });

  it('shows zero selection without adding a redundant reset button', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarFilterStatus
        activeFilterCount={0}
        onResetFilters={vi.fn()}
        selectedVideoCount={0}
      />,
    );

    expect(html).toContain('화면 선택 0개');
    expect(html).not.toContain('필터 초기화');
  });
});
