import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelWatchlistWorkspace from './ChannelWatchlistWorkspace';

describe('ChannelWatchlistWorkspace', () => {
  it('renders active channel priorities and keeps lookup and collection actions distinct', () => {
    const html = renderToStaticMarkup(
      <ChannelWatchlistWorkspace
        channels={[{
          id: 'channel-1',
          title: 'Priority Channel',
          grade: 'S',
          status: 'active',
        }]}
        channelsLoading={false}
        onLoadStoredVideos={() => {}}
        onOpenChannelList={() => {}}
        onOpenSelectedScan={() => {}}
        onRefreshChannels={() => {}}
        onToggleSelection={() => {}}
        selectedChannelIds={['channel-1']}
      />,
    );

    expect(html).toContain('data-testid="creator-route-channel-watchlist"');
    expect(html).toContain('Priority Channel');
    expect(html).toContain('S 등급 핵심 채널');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('Cloud DB에서 조회');
    expect(html).toContain('새 영상 수집 화면');
    expect(html).toContain('실제 실행 시 YouTube API');
  });
});
