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
    expect(html).toContain('개인 링크 추가·삭제');
  });
});
