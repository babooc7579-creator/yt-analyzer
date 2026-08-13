import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../hooks/useYoutubeKeywordSearch', () => ({
  useYoutubeKeywordSearch: vi.fn(() => ({
    appliedFilters: { query: '아이디어', regionCode: 'KR', language: 'ko', dateRange: '30', duration: 'shorts', minimumViews: 0, order: 'relevance' },
    addChannelRegistrationIds: vi.fn(),
    channelRegistrationFilter: 'all',
    channelRegistrationIds: ['channel-1'],
    changeChannelRegistrationFilter: vi.fn(),
    changeTitleScriptFilter: vi.fn(),
    changeResultSort: vi.fn(),
    changeShortsConfidenceFilter: vi.fn(),
    changeFilter: vi.fn(),
    clearResults: vi.fn(),
    clearSelected: vi.fn(),
    clearChannelRegistrationIds: vi.fn(),
    displayedItems: [{
      videoId: 'video-1',
      title: '좋은 아이디어 영상',
      channelTitle: '아이디어 채널',
      channelId: 'channel-1',
      publishedAt: '2026-08-01T00:00:00Z',
      duration: '08:03',
      durationSeconds: 483,
      viewCount: 10000,
      subscriberCount: 2000,
      hiddenSubscriberCount: false,
      viralRatio: 500,
      lifetimeViewsPerDay: 5000,
      url: 'https://www.youtube.com/watch?v=video-1',
    }, {
      videoId: 'video-2', title: '두 번째 아이디어 영상', channelTitle: '아이디어 채널', channelId: 'channel-1', publishedAt: '2026-08-02T00:00:00Z',
      duration: '03:00', durationSeconds: 180, description: '세로 영상 #Shorts', viewCount: 5000, subscriberCount: 2000, hiddenSubscriberCount: false, viralRatio: 250,
      lifetimeViewsPerDay: 2500, url: 'https://www.youtube.com/watch?v=video-2',
    }],
    error: '',
    filters: { query: '아이디어', regionCode: '', language: '', dateRange: '30', duration: '', minimumViews: 0, order: 'relevance' },
    items: [{
      videoId: 'video-1', title: '좋은 아이디어 영상', channelTitle: '아이디어 채널', channelId: 'channel-1', publishedAt: '2026-08-01T00:00:00Z',
      duration: '08:03', durationSeconds: 483, viewCount: 10000, subscriberCount: 2000, hiddenSubscriberCount: false, viralRatio: 500,
      lifetimeViewsPerDay: 5000, url: 'https://www.youtube.com/watch?v=video-1',
    }, {
      videoId: 'video-2', title: '두 번째 아이디어 영상', channelTitle: '아이디어 채널', channelId: 'channel-1', publishedAt: '2026-08-02T00:00:00Z',
      duration: '03:00', durationSeconds: 180, description: '세로 영상 #Shorts', viewCount: 5000, subscriberCount: 2000, hiddenSubscriberCount: false, viralRatio: 250,
      lifetimeViewsPerDay: 2500, url: 'https://www.youtube.com/watch?v=video-2',
    }],
    lastQuery: '아이디어',
    loading: false,
    nextPageToken: 'next',
    notice: '1개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.',
    removeSelected: vi.fn(),
    resetResultView: vi.fn(),
    resultSort: 'received',
    runSearch: vi.fn(),
    selectedIds: ['video-1'],
    shortsConfidenceFilter: 'all',
    setNotice: vi.fn(),
    toggleSelected: vi.fn(),
    toggleChannelRegistration: vi.fn(),
    titleScriptFilter: 'all',
  })),
}));

import YoutubeKeywordSearchPanel from './YoutubeKeywordSearchPanel';

describe('YoutubeKeywordSearchPanel', () => {
  it('explains the API boundary, estimate metrics, and selected save destination', () => {
    const html = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinks={[]} onSaveDiscoveryLink={vi.fn()} />
    );
    expect(html).toContain('키워드로 YouTube 영상 찾기');
    expect(html).toContain('검색 버튼을 눌렀을 때만 YouTube API');
    expect(html).toContain('결과는 아직 저장되지 않았습니다');
    expect(html).toContain('저장할 새 영상 1개');
    expect(html).toContain('새 영상 1개 발견 링크함에 담기');
    expect(html).toContain('현재 검색 결과 2개 중 이미 발견 링크함에 저장된 영상 0개');
    expect(html).toContain('영상 링크 분류');
    expect(html).toContain('카이온학습 (영상 링크 분류)');
    expect(html).toContain('채널 전체의 분야를 정하는 채널 태그와는 별개');
    expect(html).toContain('영상 파일은 저장하지 않습니다');
    expect(html).toContain('대박 비율은 현재 조회수÷현재 구독자 수의 추정값');
    expect(html).toContain('앱 계산 지표 기준 보기');
    expect(html).toContain('먼저 결정: 이 영상과 출처 채널을 각각 필요한 항목만 선택');
    expect(html).toContain('게시 2026. 8. 1. 오전 9:00');
    expect(html).toMatch(/게시 2026\. 8\. 1\. 오전 9:00 · \d+일 전/);
    expect(html).toContain('다음 결과 25개 불러오기');
    expect(html).toContain('첫 검색의 국가·언어·기간·길이·정렬 조건을 유지');
    expect(html).toContain('이 채널 등록 검토');
    expect(html).toContain('이 영상의 채널 주소를 채웁니다');
    expect(html).toContain('검색 지역은 해당 나라에서 시청 가능한 결과');
    expect(html).toContain('마지막 검색에 적용된 조건');
    expect(html).toContain('대한민국에서 시청 가능 · 한국어 우선 · 최근 30일');
    expect(html).toContain('싱가포르');
    expect(html).toContain('포르투갈어 우선');
    expect(html).toContain('대한민국·한국어 우선 빠른 설정');
    expect(html).toContain('쇼츠 후보 전용');
    expect(html).toContain('쇼츠 후보 (3분 이하)');
    expect(html).toContain('API로 세로·정사각형 화면 여부를 확정할 수 없어');
    expect(html).toContain('쇼츠 후보');
    expect(html).toContain('쇼츠 가능성 높음 1개');
    expect(html).toContain('확인 필요 0개');
    expect(html).toContain('가능성 높음만');
    expect(html).toContain('확인 필요만');
    expect(html).toContain('제목 또는 설명에 Shorts 표기가 있습니다');
    expect(html).toContain('YouTube에서 쇼츠 여부 확인');
    expect(html).toContain('검색 조건이 바뀌었습니다');
    expect(html).toContain('표시 결과 2개 / 검색 결과 2개');
    expect(html).toContain('미등록 채널만');
    expect(html).toContain('한글 포함 제목');
    expect(html).toContain('한글 없는 제목');
    expect(html).toContain('현재 검색 결과 정렬');
    expect(html).toContain('조회수 높은순');
    expect(html).toContain('대박 비율 높은순');
    expect(html).toContain('결과 좁히기 · 화면에서만 적용');
    expect(html).toContain('선택 영상 저장 설정');
    expect(html).toContain('화면 필터 초기화');
    expect(html).toContain('실제 음성·자막 언어를 판정하지 않으며');
    expect(html).toContain('영상 아이디어 작업');
    expect(html).toContain('영상 후보 선택 해제');
    expect(html).toContain('출처 채널 작업');
    expect(html).toContain('자동 등록하거나 영상을 저장하지 않습니다');
    expect(html).toContain('임시 결과 지우기');
    expect(html).toContain('검색 조건을 남기고 결과·영상 선택·화면 필터만 정리');
    expect(html).toContain('발견 링크함에 이미 저장한 항목은 삭제하지 않습니다');
    expect(html).toContain('외부 관심도 확인');
    expect(html).toContain('Google Trends 기준 지역: 대한민국(기본)');
    expect(html).toContain('geo=KR&amp;q=%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4');
    expect(html).toContain('검색 결과 구성 요약');
    expect(html).toContain('YouTube 전체 검색량이나 급상승 판정이 아닙니다');
    expect(html).toContain('미등록 채널 영상만 보기');
    expect(html).toContain('평균 조회수');
    expect(html).toContain('반복 등장한 미등록 출처 채널');
    expect(html).toContain('영상 2개 · 등록 검토');
    expect(html).toContain('중요 채널 후보 1개 / 최대 50개');
    expect(html).toContain('등록 후보에 포함됨');
    expect(html).toContain('같은 채널의 영상이 여러 개여도 채널 ID 기준 후보 1개로 묶고');
    expect(html).toContain('선택 1개 일괄 등록 검토');
    expect(html).toContain('YouTube API 확인 후 일괄 저장');
    expect(html).toContain('이 화면의 작업 구분');
    expect(html).toContain('기존 중복 확인');
    expect(html).toContain('Azure DB 조회');
    expect(html).toContain('선택 영상 담기');
    expect(html).toContain('Azure DB 저장');
    expect(html).toContain('채널 등록 검토');
    expect(html).toContain('화면 이동');
  });

  it('marks a result already present in the discovery inbox as saved', () => {
    const html = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinks={[{ linkedVideoId: 'video-1' }]} onSaveDiscoveryLink={vi.fn()} />
    );
    expect(html).toContain('발견 링크함에 저장됨');
    expect(html).toContain('현재 검색 결과 2개 중 이미 발견 링크함에 저장된 영상 1개');
    expect(html).toContain('선택 중 중복 1개 제외');
    expect(html).toContain('새 영상 0개 발견 링크함에 담기');
  });

  it('recognizes a manually saved YouTube URL even when linkedVideoId is missing', () => {
    const html = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinks={[{ url: 'https://youtu.be/video-1?si=manual' }]} onSaveDiscoveryLink={vi.fn()} />
    );
    expect(html).toContain('발견 링크함에 저장됨');
    expect(html).toContain('이미 발견 링크함에 저장된 영상 1개');
  });

  it('blocks saving while the discovery inbox duplicate check is loading or unavailable', () => {
    const loadingHtml = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinksLoading onSaveDiscoveryLink={vi.fn()} />
    );
    expect(loadingHtml).toContain('발견 링크함을 확인해 기존 저장 여부를 대조하고 있습니다');
    expect(loadingHtml).toContain('기존 발견 링크 조회를 완료해야 중복 없이 저장할 수 있습니다');

    const errorHtml = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinksError="Cloud lookup failed" onReloadDiscoveryLinks={vi.fn()} onSaveDiscoveryLink={vi.fn()} />
    );
    expect(errorHtml).toContain('발견 링크함을 불러오지 못해 중복 여부를 확인할 수 없습니다');
    expect(errorHtml).toContain('발견 링크함 다시 확인');
  });

  it('marks the source channel as already registered and prevents duplicate registration review', () => {
    const html = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel
        discoveryLinks={[]}
        onPrepareChannelRegistration={vi.fn()}
        onSaveDiscoveryLink={vi.fn()}
        registeredChannelIds={['channel-1']}
      />
    );
    expect(html).toContain('등록 채널');
    expect(html).toContain('이미 등록된 채널');
  });
});
