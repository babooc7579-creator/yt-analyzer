import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import HomeWorkspaceShortcuts from './HomeWorkspaceShortcuts';

describe('HomeWorkspaceShortcuts', () => {
  it('renders three screen-only shortcuts without invoking their handlers', () => {
    const handlers = {
      onOpenKeywordExplorer: vi.fn(),
      onOpenTagVault: vi.fn(),
      onOpenUploadCalendar: vi.fn(),
    };

    const html = renderToStaticMarkup(<HomeWorkspaceShortcuts {...handlers} />);

    expect(html).toContain('실사용 도구');
    expect(html).toContain('키워드 탐색');
    expect(html).toContain('태그별 금고');
    expect(html).toContain('업로드 캘린더');
    expect(html).toContain('자동 수집, 온라인 저장소(Azure DB) 저장, 상태 변경은 실행하지 않습니다');
    expect(Object.values(handlers).every((handler) => handler.mock.calls.length === 0)).toBe(true);
  });
});
