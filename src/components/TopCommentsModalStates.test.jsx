import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import TopCommentsModal from './TopCommentsModal';

const noop = () => {};

describe('TopCommentsModal states', () => {
  it('renders loading, error, and empty states for the YouTube comment lookup modal', () => {
    const loadingHtml = renderToStaticMarkup(
      <TopCommentsModal
        modal={{
          comments: [],
          isOpen: true,
          loading: true,
          videoTitle: '댓글 볼 영상',
        }}
        onClose={noop}
      />,
    );
    const errorHtml = renderToStaticMarkup(
      <TopCommentsModal
        modal={{
          comments: [],
          error: '댓글 Top 10 조회에는 YouTube API Key가 필요합니다. 이 기능은 YouTube API를 호출합니다.',
          isOpen: true,
          loading: false,
          videoTitle: '댓글 볼 영상',
        }}
        onClose={noop}
      />,
    );
    const emptyHtml = renderToStaticMarkup(
      <TopCommentsModal
        modal={{
          comments: [],
          isOpen: true,
          loading: false,
          videoTitle: '댓글 볼 영상',
        }}
        onClose={noop}
      />,
    );

    expect(loadingHtml).toContain('찐팬 반응 분석 (Top 10)');
    expect(loadingHtml).toContain('원본 영상:');
    expect(loadingHtml).toContain('댓글 데이터를 불러오는 중...');
    expect(errorHtml).toContain('댓글 Top 10 조회에는 YouTube API Key가 필요합니다. 이 기능은 YouTube API를 호출합니다.');
    expect(emptyHtml).toContain('조회된 댓글이 없습니다.');
  });
});
