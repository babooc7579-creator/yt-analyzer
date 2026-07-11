import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelListLoadingState from './ChannelListLoadingState';

describe('ChannelListLoadingState', () => {
  it('renders channel loading as Cloud lookup without scan side effects', () => {
    const html = renderToStaticMarkup(<ChannelListLoadingState />);

    expect(html).toContain('Cloud 채널 목록을 불러오는 중입니다.');
    expect(html).toContain('영상 수집이나 YouTube API 호출은 실행하지 않습니다.');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});
