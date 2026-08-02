import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../hooks/useYoutubeKeywordSearch', () => ({
  useYoutubeKeywordSearch: vi.fn(() => ({
    changeFilter: vi.fn(),
    clearSelected: vi.fn(),
    displayedItems: [{
      videoId: 'video-1',
      title: '좋은 아이디어 영상',
      channelTitle: '아이디어 채널',
      channelId: 'channel-1',
      publishedAt: '2026-08-01T00:00:00Z',
      duration: '08:03',
      viewCount: 10000,
      subscriberCount: 2000,
      hiddenSubscriberCount: false,
      viralRatio: 500,
      lifetimeViewsPerDay: 5000,
      url: 'https://www.youtube.com/watch?v=video-1',
    }],
    error: '',
    filters: { query: '아이디어', regionCode: '', language: '', dateRange: '30', duration: '', minimumViews: 0, order: 'relevance' },
    items: [{
      videoId: 'video-1', title: '좋은 아이디어 영상', channelTitle: '아이디어 채널', channelId: 'channel-1', publishedAt: '2026-08-01T00:00:00Z',
      duration: '08:03', viewCount: 10000, subscriberCount: 2000, hiddenSubscriberCount: false, viralRatio: 500,
      lifetimeViewsPerDay: 5000, url: 'https://www.youtube.com/watch?v=video-1',
    }],
    lastQuery: '아이디어',
    loading: false,
    nextPageToken: 'next',
    notice: '1개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.',
    removeSelected: vi.fn(),
    runSearch: vi.fn(),
    selectedIds: ['video-1'],
    setNotice: vi.fn(),
    toggleSelected: vi.fn(),
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
    expect(html).toContain('선택 1개 발견 링크함에 담기');
    expect(html).toContain('영상 파일은 저장하지 않습니다');
    expect(html).toContain('대박 비율은 현재 조회수÷현재 구독자 수의 추정값');
    expect(html).toContain('다음 결과 25개 불러오기');
    expect(html).toContain('이 채널 등록 검토');
    expect(html).toContain('이 영상의 채널 주소를 채웁니다');
  });

  it('marks a result already present in the discovery inbox as saved', () => {
    const html = renderToStaticMarkup(
      <YoutubeKeywordSearchPanel discoveryLinks={[{ linkedVideoId: 'video-1' }]} onSaveDiscoveryLink={vi.fn()} />
    );
    expect(html).toContain('발견 링크함에 저장됨');
    expect(html).toContain('선택 0개 발견 링크함에 담기');
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
