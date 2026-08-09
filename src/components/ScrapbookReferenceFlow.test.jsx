import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ReferenceVaultEmptyState from './ReferenceVaultEmptyState';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookVideoFooterActions from './ScrapbookVideoFooterActions';

const noop = () => {};

describe('Scrapbook and reference vault flow', () => {
  it('renders scrapbook empty actions as safe navigation and 온라인 저장소(Azure DB) lookup guidance', () => {
    const html = renderToStaticMarkup(
      <ScrapbookEmptyState onOpenHome={noop} onOpenReferenceVault={noop} />,
    );

    expect(html).toContain('스크랩된 영상이 없습니다');
    expect(html).toContain('오늘 레이더로');
    expect(html).toContain('수집 영상 목록');
    expect(html).toContain('온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 조회합니다. 새 YouTube API 호출은 없습니다.');
    expect(html).toContain('온라인 저장소(Azure DB)의 소재 보관함에 보관합니다.');
  });

  it('renders reference vault empty state as channel selection, stored lookup, then optional scan', () => {
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

    expect(html).toContain('불러온 수집 영상 정보가 없습니다');
    expect(html).toContain('현재 상태 · 선택 채널 0개 · 불러온 영상 0개');
    expect(html).toContain('먼저 오늘 확인할 채널을 선택하세요');
    expect(html).toContain('영상 자체를 고르는 것이 아니라');
    expect(html).toContain('1. 오늘 볼 채널 선택');
    expect(html).toContain('2. 수집 영상 목록 불러오기');
    expect(html).toContain('온라인 저장소(Azure DB)에 이미 보관된 수집 영상 정보를 먼저 조회합니다. 새 YouTube API 호출은 없습니다.');
    expect(html).toContain('3. 필요할 때 새 영상 수집');
    expect(html).toContain('새 데이터가 필요할 때만 선택 채널을 수집합니다. 이 단계는 YouTube API를 호출할 수 있습니다.');
    expect(html).toContain('오늘 레이더로');
  });

  it('shows a direct Azure DB lookup action when channels are already selected', () => {
    const html = renderToStaticMarkup(
      <ReferenceVaultEmptyState
        actions={[]}
        onLoadStoredVideos={noop}
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('오늘 볼 채널 2개가 선택되었습니다');
    expect(html).toContain('선택 채널 수집 영상 목록 불러오기 (2개)');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('explains the next safe action after an empty Azure DB lookup', () => {
    const html = renderToStaticMarkup(
      <ReferenceVaultEmptyState
        actions={[]}
        loadResult={{ success: true, videoCount: 0 }}
        onLoadStoredVideos={noop}
        onOpenSelectedScan={noop}
        selectedChannelCount={1}
      />,
    );

    expect(html).toContain('조회는 완료됐지만 수집된 영상 정보가 없습니다');
    expect(html).toContain('새 영상 수집 화면 열기');
    expect(html).toContain('이동만으로 YouTube API 호출이나 수집은 시작되지 않습니다');
  });

  it('renders scrapbook card buttons as URL copy, comment API, and Cloud scrapbook removal actions', () => {
    const html = renderToStaticMarkup(
      <ScrapbookVideoFooterActions
        onFetchComments={noop}
        onPromoteToProduction={noop}
        onRemoveScrap={noop}
        video={{ videoId: 'video-1', title: '보관 영상' }}
        videoTitle="보관 영상"
        videoUrl="https://www.youtube.com/watch?v=video-1"
      />,
    );

    expect(html).toContain('YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.');
    expect(html).toContain('댓글 Top 10 보기 - 버튼을 누를 때만 YouTube API로 댓글을 조회합니다.');
    expect(html).toContain('조회 결과를 온라인 저장소(Azure DB)에 저장하지 않습니다.');
    expect(html).toContain('제작 후보로');
    expect(html).toContain('온라인 저장소(Azure DB)의 판단 기록에 제작 후보로 표시하고 제작 후보함에서 이어서 관리합니다. YouTube API를 새로 호출하지 않습니다.');
    expect(html).toContain('온라인 저장소(Azure DB)의 소재 보관 표시만 해제합니다. YouTube 원본이나 수집 영상 정보는 삭제하지 않습니다.');
    expect(html).toContain('flex-wrap');
  });
});
