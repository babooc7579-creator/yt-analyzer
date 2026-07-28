import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoCardMetaActions from './VideoCardMetaActions';
import VideoCardPrimaryActions from './VideoCardPrimaryActions';
import VideoListRowCandidateAction from './VideoListRowCandidateAction';

const noop = () => {};

const video = {
  duration: '00:42',
  isShorts: true,
  language: 'en',
  title: '좋은 영상',
  videoId: 'video-1',
};

describe('Video action safety controls', () => {
  it('renders video card primary actions as Cloud scrapbook and production candidate decisions', () => {
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

    expect(html).toContain('소재 보관');
    expect(html).toContain('제작 후보');
    expect(html).toContain('온라인 저장소(Azure DB)');
    expect(html).toContain('YouTube API');
  });

  it('renders metadata actions as comment API and local URL copy actions', () => {
    const html = renderToStaticMarkup(
      <VideoCardMetaActions
        onFetchComments={noop}
        video={video}
        videoTitle="좋은 영상"
        videoUrl="https://www.youtube.com/watch?v=video-1"
      />,
    );

    expect(html).toContain('댓글 Top 10 보기 - 버튼을 누를 때만 YouTube API로 댓글을 조회합니다.');
    expect(html).toContain('조회 결과를 온라인 저장소(Azure DB)에 저장하지 않습니다.');
    expect(html).toContain('좋은 영상 YouTube 원본 URL 복사');
    expect(html).toContain('YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.');
  });

  it('renders list row candidate action with Cloud decision copy and disabled candidate state', () => {
    const html = renderToStaticMarkup(
      <VideoListRowCandidateAction
        disabled={false}
        isProductionCandidate
        onPromote={noop}
        videoTitle="좋은 영상"
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('좋은 영상');
    expect(html).toContain('온라인 저장소(Azure DB)');
  });
});
