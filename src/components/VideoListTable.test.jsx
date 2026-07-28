import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoListTable from './VideoListTable';

describe('VideoListTable', () => {
  it('renders a compact mobile list and keeps the wide table for desktop', () => {
    const video = {
      videoId: 'video-1',
      title: 'Compact mobile idea with an intentionally very long title that should remain readable',
      view_count: 120000,
      like_count: 3000,
      like_ratio: 2.5,
      multiplier: 3.2,
      upload_date: '2026-07-01',
      daysOld: 28,
    };
    const html = renderToStaticMarkup(
      <VideoListTable
        videos={[video]}
        checkedVideos={[]}
        isVideoSaved={() => false}
        isProductionCandidate={() => false}
        toggleCheckVideo={vi.fn()}
        toggleScrapVideo={vi.fn()}
        promoteVideoToProduction={vi.fn()}
        fetchTopComments={vi.fn()}
      />,
    );

    expect(html).toContain('모바일 리스트는 제목·조회수·대박 지수·게시일과 핵심 작업만 간단히 보여줍니다');
    expect(html).toContain('Compact mobile idea');
    expect(html).toContain('120,000');
    expect(html).toContain('line-clamp-3');
    expect(html).toContain('min-[360px]:grid-cols-2');
    expect(html).toContain('[&amp;&gt;button]:w-full');
    expect(html).toContain('md:hidden');
    expect(html).toContain('md:block');
    expect(html).toContain('overflow-x-auto');
  });
});
