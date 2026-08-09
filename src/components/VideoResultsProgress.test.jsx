import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoResultsProgress from './VideoResultsProgress';

describe('VideoResultsProgress', () => {
  it('explains incremental display without suggesting an API or DB action', () => {
    const html = renderToStaticMarkup(
      <VideoResultsProgress displayedCount={60} onShowMore={() => {}} pageSize={60} totalCount={3148} />,
    );

    expect(html).toContain('검색 결과 3,148개 중 60개 표시 중');
    expect(html).toContain('영상 60개 더 보기 (60/3,148)');
    expect(html).toContain('Azure DB 재조회·저장이나 YouTube API 호출은 없습니다');
  });

  it('shows the exact remaining amount on the last increment', () => {
    const html = renderToStaticMarkup(
      <VideoResultsProgress displayedCount={120} onShowMore={() => {}} pageSize={60} totalCount={125} />,
    );

    expect(html).toContain('영상 5개 더 보기 (120/125)');
  });

  it('stays hidden for results that already fit in the first page', () => {
    expect(renderToStaticMarkup(
      <VideoResultsProgress displayedCount={25} onShowMore={() => {}} pageSize={60} totalCount={25} />,
    )).toBe('');
  });
});
