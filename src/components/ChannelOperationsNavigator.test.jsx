import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelOperationsNavigator from './ChannelOperationsNavigator';

describe('ChannelOperationsNavigator', () => {
  it('renders one workflow with three distinct operation stages', () => {
    const html = renderToStaticMarkup(<ChannelOperationsNavigator activeStage="add" />);

    expect(html).toContain('채널 운영실');
    expect(html).toContain('1. 채널 관리');
    expect(html).toContain('2. 새 채널 등록');
    expect(html).toContain('3. 새 영상 수집');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('채널 선택만으로 YouTube API는 호출되지 않습니다');
    expect(html).toContain('다음 추천 행동');
    expect(html).toContain('새 채널 등록하기');
    expect(html).toContain('이동만으로 YouTube API 호출이나 Cloud 저장은 실행되지 않습니다');
  });

  it('shows stored-video and radar actions when videos are ready', () => {
    const html = renderToStaticMarkup(
      <ChannelOperationsNavigator
        savedChannels={[{ id: 'channel-1' }]}
        selectedChannelIds={['channel-1']}
        videos={[
          { videoId: 'video-1', channel_id: 'channel-1' },
          { videoId: 'video-2', channel_id: 'channel-1' },
        ]}
      />,
    );

    expect(html).toContain('영상이 준비됐습니다');
    expect(html).toContain('저장 영상 2개 보기');
    expect(html).toContain('오늘의 레이더로');
    expect(html).toContain('1개 선택');
  });
});
