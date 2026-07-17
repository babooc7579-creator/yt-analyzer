import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import CreatorActionFeedback from './CreatorActionFeedback';

describe('CreatorActionFeedback', () => {
  it('shows errors ahead of progress messages with login recovery guidance', () => {
    const html = renderToStaticMarkup(
      <CreatorActionFeedback
        error="Cloud DB 조회 실패"
        onClearError={vi.fn()}
        progressMessage="불러오는 중"
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Cloud DB 조회 실패');
    expect(html).toContain('Microsoft 로그인 세션이 만료될 수 있습니다');
    expect(html).toContain('오류 안내 닫기');
    expect(html).not.toContain('불러오는 중');
  });

  it('shows progress when there is no error', () => {
    const html = renderToStaticMarkup(
      <CreatorActionFeedback progressMessage="저장 영상을 불러오는 중입니다" />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('저장 영상을 불러오는 중입니다');
    expect(html).not.toContain('작업을 완료하지 못했습니다');
  });

  it('renders nothing without feedback', () => {
    expect(renderToStaticMarkup(<CreatorActionFeedback />)).toBe('');
  });
});
