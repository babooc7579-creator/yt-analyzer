import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelWatchlistHeader from './ChannelWatchlistHeader';

describe('ChannelWatchlistHeader', () => {
  it('blocks duplicate stored-video lookups while the Cloud request is pending', () => {
    const html = renderToStaticMarkup(
      <ChannelWatchlistHeader
        selectedChannelCount={2}
        storedVideoLoadPending
      />,
    );

    expect(html).toContain('저장 영상 불러오는 중...');
    expect(html).toContain('disabled');
    expect(html).toContain('새 영상 수집 화면');
  });
});
