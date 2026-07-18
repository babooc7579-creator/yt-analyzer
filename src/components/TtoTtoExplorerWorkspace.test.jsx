import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import TtoTtoExplorerWorkspace from './TtoTtoExplorerWorkspace';

describe('TtoTtoExplorerWorkspace', () => {
  it('explains the stored-data boundary and shows the load action when empty', () => {
    const html = renderToStaticMarkup(
      <TtoTtoExplorerWorkspace
        isVideoSaved={() => false}
        onLoadStoredVideos={() => {}}
        selectedChannelCount={2}
        savedVideos={[]}
        videoUserRecords={{}}
        videos={[]}
      />,
    );

    expect(html).toContain('data-testid="creator-route-ttotto"');
    expect(html).toContain('6개월 이상');
    expect(html).toContain('1.5배 이상');
    expect(html).toContain('Cloud DB에 이미 저장된 영상만 사용');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('YouTube API를 자동 호출하지 않습니다');
  });

  it('renders strict candidates and filter controls', () => {
    const html = renderToStaticMarkup(
      <TtoTtoExplorerWorkspace
        isVideoSaved={() => false}
        selectedChannelCount={1}
        savedVideos={[]}
        videoUserRecords={{}}
        videos={[{
          videoId: 'candidate-1',
          title: 'Validated idea',
          channel_title: 'Channel',
          daysOld: 220,
          multiplier: 2,
          view_count: 100000,
        }]}
      />,
    );

    expect(html).toContain('Validated idea');
    expect(html).toContain('제목 또는 채널 검색');
    expect(html).toContain('추천순');
    expect(html).toContain('현재 표시 1개');
  });

  it('disables duplicate stored-video lookup while Cloud data is loading', () => {
    const html = renderToStaticMarkup(
      <TtoTtoExplorerWorkspace
        isVideoSaved={() => false}
        loading
        onLoadStoredVideos={() => {}}
        selectedChannelCount={2}
        savedVideos={[]}
        videoUserRecords={{}}
        videos={[]}
      />,
    );

    expect(html).toContain('저장 영상 불러오는 중...');
    expect(html).toContain('disabled');
  });
});
