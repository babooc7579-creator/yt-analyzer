import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import WorkToolSettingsPanel from './WorkToolSettingsPanel';

describe('WorkToolSettingsPanel', () => {
  it('renders safe default management and editable Cloud custom tools', () => {
    const html = renderToStaticMarkup(
      <WorkToolSettingsPanel
        onSave={vi.fn()}
        preferences={{
          customTools: [{
            id: 'custom-1',
            label: '내 분석 도구',
            description: '매일 확인',
            href: 'https://example.com/',
            groupId: 'personal',
            badge: '개인 도구',
          }],
          hiddenDefaultToolIds: ['youtube-studio'],
          toolOrder: ['custom-1', 'google-trends'],
        }}
      />
    );

    expect(html).toContain('즐겨찾기 추가·숨김·순서 변경');
    expect(html).toContain('내 분석 도구');
    expect(html).toContain('도구함에서 숨김');
    expect(html).toContain('기본 도구');
    expect(html).toContain('기본값으로 되돌리기');
    expect(html).toContain('변경사항 저장');
    expect(html).toContain('개인 도구 추가');
    expect(html).toContain('<form');
  });
});
