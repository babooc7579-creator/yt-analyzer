import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoCardCandidateReasons from './VideoCardCandidateReasons';
import VideoCardPrimaryActions from './VideoCardPrimaryActions';
import VideoCardStatsGrid from './VideoCardStatsGrid';
import VideoCardThumbnailActions from './VideoCardThumbnailActions';

const noop = () => {};
const video = {
  daysOld: 150,
  like_count: 1234,
  like_ratio: 1.5,
  multiplier: 2.4,
  upload_date: '2026-04-01',
  videoId: 'video-1',
  view_count: 123456,
};

describe('VideoCard decision-first layout', () => {
  it('shows publish date and elapsed days together', () => {
    const html = renderToStaticMarkup(
      <VideoCardStatsGrid isStrongReaction={false} showWorkPanel={false} video={video} />,
    );

    expect(html).toContain('게시일');
    expect(html).toContain('26년 4월 1일');
    expect(html).toContain('(150일 경과)');
  });

  it('keeps a neutral comparison reason when candidate reasons are empty', () => {
    const html = renderToStaticMarkup(<VideoCardCandidateReasons candidateReasons={[]} />);

    expect(html).toContain('비교 참고');
    expect(html).toContain('현재 또터또 기준에는 해당하지 않는 비교 참고 영상입니다.');
    expect(html).toContain('min-h-[58px]');
  });

  it('renders production candidate before the secondary scrapbook action', () => {
    const html = renderToStaticMarkup(
      <VideoCardPrimaryActions
        isProductionCandidate={false}
        isSaved={false}
        onPromoteToProduction={noop}
        onToggleScrap={noop}
        video={video}
        videoTitle="좋은 영상"
      />,
    );

    expect(html.indexOf('제작 후보로')).toBeLessThan(html.indexOf('소재 보관'));
    expect(html).toContain('border-yellow-300 bg-white text-yellow-700');
  });

  it('keeps only AI prompt selection on the thumbnail overlay', () => {
    const html = renderToStaticMarkup(
      <VideoCardThumbnailActions
        isChecked={false}
        onToggleCheck={noop}
        video={video}
        videoTitle="좋은 영상"
      />,
    );

    expect(html).toContain('AI 요청문 포함 선택');
    expect(html).not.toContain('소재 보관');
  });
});
