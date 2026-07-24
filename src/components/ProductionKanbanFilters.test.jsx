import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanFilteredEmptyState from './ProductionKanbanFilteredEmptyState';
import ProductionKanbanFilters from './ProductionKanbanFilters';

const noop = () => {};

describe('ProductionKanbanFilters', () => {
  it('renders search, stage options, and a no-API explanation', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: false, metricText: '작업 항목 5개' }}
        onFilterModeChange={noop}
        onReset={noop}
        onSearchQueryChange={noop}
        searchQuery=""
      />,
    );

    expect(html).toContain('제작 작업 찾기');
    expect(html).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('영상 제목, 채널, 내 제목, 메모 검색');
    expect(html).toContain('오늘 집중');
    expect(html).toContain('발견 링크');
    expect(html).toContain('Cloud 저장 전');
    expect(html).toContain('작업 항목 5개');
  });

  it('renders a reset action when filters have no result', () => {
    const html = renderToStaticMarkup(<ProductionKanbanFilteredEmptyState onReset={noop} />);

    expect(html).toContain('조건에 맞는 제작 작업이 없습니다');
    expect(html).toContain('전체 작업 보기');
  });

  it('renders an actionable unsaved draft shortcut only when changes exist', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{
          hasActiveFilters: false,
          metricText: '작업 항목 5개',
          unsavedCount: 2,
        }}
        onFilterModeChange={noop}
        onReset={noop}
        onSearchQueryChange={noop}
        searchQuery=""
      />,
    );

    expect(html).toContain('Cloud 저장 전 2개');
    expect(html).toContain('이 버튼은 저장을 실행하지 않습니다.');
    expect(html).toContain('Cloud에 저장하지 않은 제작안 2개');
    expect(html).toContain('다른 화면 이동·새로고침·탭 닫기 전에 확인합니다.');
    expect(html).toContain('각 카드에서 Cloud 저장을 완료하면 이 안내와 경고가 사라집니다.');
    expect(html).toContain('aria-pressed="false"');
  });

  it('hides unsaved protection guidance after every production draft is saved', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{
          hasActiveFilters: false,
          metricText: '작업 항목 5개',
          unsavedCount: 0,
        }}
        onFilterModeChange={noop}
        onReset={noop}
        onSearchQueryChange={noop}
        searchQuery=""
      />,
    );

    expect(html).not.toContain('Cloud에 저장하지 않은 제작안');
    expect(html).not.toContain('탭 닫기 전에 확인합니다.');
  });

  it('explains a calendar-originated search and offers a display-only reset', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: true, metricText: '전체 5개 중 1개 표시' }}
        onFilterModeChange={noop}
        onReset={noop}
        onReturnToSearchSource={noop}
        onSearchQueryChange={noop}
        searchContext={{
          description: '업로드 캘린더에서 선택한 항목을 찾고 있습니다.',
          label: '캘린더에서 가져온 검색',
          resetLabel: '전체 작업 보기',
          resetTitle: '캘린더에서 가져온 화면 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
          returnLabel: '캘린더로 돌아가기',
          returnTitle: '업로드 캘린더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
        }}
        searchQuery="예약 영상"
      />,
    );

    expect(html).toContain('캘린더에서 가져온 검색');
    expect(html).toContain('업로드 캘린더에서 선택한 항목을 찾고 있습니다.');
    expect(html).toContain('전체 작업 보기');
    expect(html).toContain('캘린더로 돌아가기');
    expect(html).toContain('Cloud 데이터는 변경하지 않습니다.');
  });

  it('renders a radar return path for a newly promoted candidate', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: true, metricText: '전체 5개 중 1개 표시' }}
        onFilterModeChange={noop}
        onReset={noop}
        onReturnToSearchSource={noop}
        onSearchQueryChange={noop}
        searchContext={{
          description: '오늘의 레이더에서 제작 후보로 표시한 영상을 보여주고 있습니다.',
          label: '오늘의 레이더에서 이어온 후보',
          resetLabel: '전체 작업 보기',
          resetTitle: '오늘의 레이더에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
          returnLabel: '오늘의 레이더로 돌아가기',
          returnTitle: '오늘의 레이더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
        }}
        searchQuery="오늘 만들 영상"
      />,
    );

    expect(html).toContain('오늘의 레이더에서 이어온 후보');
    expect(html).toContain('오늘의 레이더로 돌아가기');
    expect(html).toContain('오늘의 레이더에서 이어온 후보 검색만 해제합니다.');
  });

  it('renders a scrapbook return path for a newly promoted candidate', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: true, metricText: '전체 5개 중 1개 표시' }}
        onFilterModeChange={noop}
        onReset={noop}
        onReturnToSearchSource={noop}
        onSearchQueryChange={noop}
        searchContext={{
          description: '스크랩북에서 제작 후보로 표시한 영상을 보여주고 있습니다.',
          label: '스크랩북에서 이어온 후보',
          resetLabel: '전체 작업 보기',
          resetTitle: '스크랩북에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
          returnLabel: '스크랩북으로 돌아가기',
          returnTitle: '스크랩북으로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
        }}
        searchQuery="보관한 소재"
      />,
    );

    expect(html).toContain('스크랩북에서 이어온 후보');
    expect(html).toContain('스크랩북으로 돌아가기');
    expect(html).toContain('스크랩북에서 이어온 후보 검색만 해제합니다.');
  });

  it('renders a discovery-link return path for a newly promoted candidate', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanFilters
        filterMode="all"
        filterSummary={{ hasActiveFilters: true, metricText: '전체 5개 중 1개 표시' }}
        onFilterModeChange={noop}
        onReset={noop}
        onReturnToSearchSource={noop}
        onSearchQueryChange={noop}
        searchContext={{
          description: '발견 링크 저장에서 제작 후보로 표시한 링크를 보여주고 있습니다.',
          label: '발견 링크에서 이어온 후보',
          resetLabel: '전체 작업 보기',
          resetTitle: '발견 링크에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
          returnLabel: '발견 링크 저장으로 돌아가기',
          returnTitle: '발견 링크 저장 화면으로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
        }}
        searchQuery="참고할 오프닝"
      />,
    );

    expect(html).toContain('발견 링크에서 이어온 후보');
    expect(html).toContain('발견 링크 저장으로 돌아가기');
    expect(html).toContain('Cloud 데이터는 변경하지 않습니다.');
  });
});
