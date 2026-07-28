import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DiscoveryLinksLoadingState from './DiscoveryLinksLoadingState';

describe('DiscoveryLinksLoadingState', () => {
  it('renders discovery loading as Cloud lookup without external collection', () => {
    const html = renderToStaticMarkup(<DiscoveryLinksLoadingState />);

    expect(html).toContain('온라인 발견함(Azure DB)을 불러오는 중입니다.');
    expect(html).toContain('외부 사이트 수집이나 자동 업로드는 실행하지 않습니다.');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});
