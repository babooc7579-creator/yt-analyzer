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
        onOpenRadar={() => {}}
        onOpenStoredVideos={() => {}}
        onOpenSelectedScan={() => {}}
        onOpenTtoTto={() => {}}
        onRefreshChannels={() => {}}
        onSetSelectedChannelIds={() => {}}
        onToggleSelection={() => {}}
        selectedChannelIds={['channel-1']}
      />,
    );

    expect(html).toContain('data-testid="creator-route-channel-watchlist"');
    expect(html).toContain('Priority Channel');
    expect(html).toContain('S 등급 핵심 채널');
    expect(html).toContain('선택 채널 저장 영상 불러오기');
    expect(html).toContain('Cloud DB에서 조회');
    expect(html).toContain('새 영상 수집 화면');
    expect(html).toContain('실제 실행 시 YouTube API');
    expect(html).toContain('저장 영상 전체 보기');
    expect(html).toContain('터또터 탐색');
    expect(html).toContain('분류 전체');
    expect(html).toContain('선택 상태 전체');
    expect(html).toContain('현재 결과 1개 선택 해제');
  });
});
