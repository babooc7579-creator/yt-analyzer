import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ReferenceVaultEmptyState from './ReferenceVaultEmptyState';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookVideoFooterActions from './ScrapbookVideoFooterActions';

const noop = () => {};

describe('Scrapbook and reference vault flow', () => {
  it('renders scrapbook empty actions as safe navigation and Cloud DB lookup guidance', () => {
    const html = renderToStaticMarkup(
      <ScrapbookEmptyState onOpenHome={noop} onOpenReferenceVault={noop} />,
    );

    expect(html).toContain('스크랩된 영상이 없습니다');
    expect(html).toContain('오늘 레이더로');
    expect(html).toContain('저장 영상 탐색');
    expect(html).toContain('Cloud DB에 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.');
    expect(html).toContain('Cloud 스크랩북에 보관합니다.');
  });

  it('renders reference vault empty state as channel save, scan, and stored lookup steps', () => {
    const html = renderToStaticMarkup(
      <ReferenceVaultEmptyState
        actions={[
          {
            ariaLabel: '오늘 레이더 화면 열기, 이동만으로 YouTube API 호출 없음',
            iconKey: 'home',
            key: 'home',
            label: '오늘 레이더로',
            onClick: noop,
            title: '오늘 레이더로 이동합니다. 화면 이동만으로 YouTube API를 새로 호출하지 않습니다.',
          },
        ]}
      />,
    );

    expect(html).toContain('레퍼런스 금고가 비어 있습니다');
    expect(html).toContain('새 데이터가 필요할 때만 실행합니다. 이 단계는 YouTube API를 호출할 수 있습니다.');
    expect(html).toContain('Cloud DB에 이미 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.');
    expect(html).toContain('오늘 레이더로');
  });

  it('renders scrapbook card buttons as URL copy, comment API, and Cloud scrapbook removal actions', () => {
    const html = renderToStaticMarkup(
      <ScrapbookVideoFooterActions
        onFetchComments={noop}
        onRemoveScrap={noop}
        video={{ videoId: 'video-1', title: '보관 영상' }}
        videoTitle="보관 영상"
        videoUrl="https://www.youtube.com/watch?v=video-1"
      />,
    );

    expect(html).toContain('YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.');
    expect(html).toContain('댓글 Top 10 보기 - 버튼을 누를 때만 YouTube API로 댓글을 조회합니다.');
    expect(html).toContain('조회 결과를 Cloud에 저장하지 않습니다.');
    expect(html).toContain('Cloud 스크랩북 보관 표시만 해제합니다. YouTube 원본이나 저장 영상 데이터는 삭제하지 않습니다.');
  });
});
