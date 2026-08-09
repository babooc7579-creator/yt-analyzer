import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoResultsPanel from './VideoResultsPanel';

const videos = Array.from({ length: 65 }, (_, index) => ({
  videoId: `video-${index + 1}`,
  title: `검수 영상 ${index + 1}`,
  thumbnail: '',
  channel_title: '검수 채널',
  daysOld: index,
  duration: '00:30',
  isShorts: true,
  like_count: 0,
  like_ratio: 0,
  multiplier: 1,
  upload_date: '2026-08-01',
  view_count: 1000,
  views_per_day: 100,
}));

const renderPanel = (viewMode) => renderToStaticMarkup(
  <VideoResultsPanel
    checkedVideos={[]}
    filteredVideos={videos}
    isProductionCandidate={() => false}
    isVideoSaved={() => false}
    onFetchComments={() => {}}
    onPromoteToProduction={() => {}}
    onToggleCheck={() => {}}
    onToggleScrap={() => {}}
    selectedChannelCount={1}
    videos={videos}
    viewMode={viewMode}
  />,
);

describe('VideoResultsPanel incremental display', () => {
  it('renders only the first 60 cards before the user asks for more', () => {
    const html = renderPanel('card');

    expect(html).toContain('검수 영상 60');
    expect(html).not.toContain('검수 영상 61');
    expect(html).toContain('검색 결과 65개 중 60개 표시 중');
  });

  it('applies the same 60-item boundary to list view', () => {
    const html = renderPanel('list');

    expect(html).toContain('검수 영상 60');
    expect(html).not.toContain('검수 영상 61');
    expect(html).toContain('영상 5개 더 보기 (60/65)');
  });
});
