import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoToolbarScanResultFeedback from './VideoToolbarScanResultFeedback';

describe('VideoToolbarScanResultFeedback', () => {
  it('shows the completed channel, counts, storage result, and safe next destination', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarScanResultFeedback
        feedback={{
          detail: '결과는 온라인 저장소(Azure DB)에 반영됐습니다.',
          statsText: '신규 영상 0개 · 통계 갱신 89개',
          title: 'Jinxy 수집 완료',
        }}
        onOpenRecentScanStatus={vi.fn()}
      />,
    );

    expect(html).toContain('Jinxy 수집 완료');
    expect(html).toContain('신규 영상 0개 · 통계 갱신 89개');
    expect(html).toContain('온라인 저장소(Azure DB)에 반영됐습니다');
    expect(html).toContain('최근 수집 상태에서 자세히 보기');
    expect(html).toContain('YouTube API 재호출 없음');
    expect(html).toContain('w-full');
    expect(html).toContain('sm:w-auto');
  });

  it('renders nothing before a scan completes', () => {
    expect(renderToStaticMarkup(
      <VideoToolbarScanResultFeedback feedback={null} />,
    )).toBe('');
  });
});
