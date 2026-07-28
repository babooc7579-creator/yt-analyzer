import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoListTable from './VideoListTable';

describe('VideoListTable', () => {
  it('explains the mobile horizontal-scroll behavior without changing data', () => {
    const html = renderToStaticMarkup(
      <VideoListTable
        videos={[]}
        checkedVideos={[]}
        isVideoSaved={() => false}
        isProductionCandidate={() => false}
        toggleCheckVideo={vi.fn()}
        toggleScrapVideo={vi.fn()}
        promoteVideoToProduction={vi.fn()}
        fetchTopComments={vi.fn()}
      />,
    );

    expect(html).toContain('모바일에서는 카드 보기가 더 편합니다');
    expect(html).toContain('좌우로 밀어서 확인');
    expect(html).toContain('md:hidden');
    expect(html).toContain('overflow-x-auto');
  });
});
