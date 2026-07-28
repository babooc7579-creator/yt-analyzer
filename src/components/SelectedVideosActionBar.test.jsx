import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import SelectedVideosActionBar from './SelectedVideosActionBar';

describe('SelectedVideosActionBar', () => {
  it('renders copy, clear, persistence, and mobile-friendly controls', () => {
    const html = renderToStaticMarkup(
      <SelectedVideosActionBar
        selectedCount={2}
        copiedPrompt={false}
        promptCopyError={false}
        onClearSelection={vi.fn()}
        onCopyPrompt={vi.fn()}
      />,
    );

    expect(html).toContain('>2</span>개 선택됨');
    expect(html).toContain('AI 요청문 복사');
    expect(html).toContain('선택 해제');
    expect(html).toContain('검색·정렬·화면 이동 뒤에도 선택은 유지됩니다');
    expect(html).toContain('새 수집 영상 목록을 불러오면 초기화됩니다');
    expect(html).toContain('flex-col');
    expect(html).toContain('sm:flex-row');
  });
});
