import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoToolbarSortControl from './VideoToolbarSortControl';

describe('VideoToolbarSortControl', () => {
  it('shows the recommendation order in plain language when recommended sort is active', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarSortControl setSortType={() => {}} sortType="recommended" />,
    );

    expect(html).toContain('추천 기준');
    expect(html).toContain('또터또 후보');
    expect(html).toContain('대박 지수');
    expect(html).toContain('일평균 반응');
    expect(html).toContain('조회수');
    expect(html).toContain('w-full');
  });

  it('hides the recommendation explanation for another sort order', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarSortControl setSortType={() => {}} sortType="views" />,
    );

    expect(html).not.toContain('추천 기준 ·');
  });
});
