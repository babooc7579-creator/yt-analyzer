import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import WorkToolsWorkspace from './WorkToolsWorkspace';

describe('WorkToolsWorkspace', () => {
  it('renders a safe external work-tool hub', () => {
    const html = renderToStaticMarkup(<WorkToolsWorkspace />);

    expect(html).toContain('data-testid="creator-route-work-tools"');
    expect(html).toContain('업무 도구함');
    expect(html).toContain('외부 데이터를 자동 수집하거나');
    expect(html).toContain('Google Trends');
    expect(html).toContain('네이버 DataLab');
    expect(html).toContain('YouTube Studio');
    expect(html).toContain('개인 링크 추가·수정·숨김·순서 변경');
    expect(html).toContain('변경사항은 온라인 저장소(Azure DB)에 저장됩니다');
    expect(html).toContain('설정에서 관리');
    expect(html).toContain('업무 도구 검색');
    expect(html).toContain('5개 도구');
  });

  it('renders Cloud custom tools and a visible retry state', () => {
    const html = renderToStaticMarkup(
      <WorkToolsWorkspace
        error="온라인 저장소(Azure DB) 연결 실패"
        onReload={() => {}}
        toolGroups={[
          {
            id: 'personal',
            title: '나의 업무 도구',
            description: '직접 추가한 도구',
            tools: [{
              id: 'custom-1',
              label: '내 키워드 도구',
              description: '매일 확인',
              href: 'https://example.com/',
              badge: '개인 도구',
            }],
          },
        ]}
      />
    );

    expect(html).toContain('온라인 저장소(Azure DB) 연결 실패');
    expect(html).toContain('다시 불러오기');
    expect(html).toContain('나의 업무 도구');
    expect(html).toContain('내 키워드 도구');
  });
});
