import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../hooks/useYoutubeChannelSearch', () => ({
  useYoutubeChannelSearch: vi.fn(() => ({
    appliedFilters: { query: '바이브 코딩', regionCode: 'JP', language: 'ja' },
    changeFilter: vi.fn(),
    error: '',
    filters: { query: '바이브 코딩', regionCode: '', language: '' },
    items: [{
      channelId: 'channel-1',
      title: '아이디어 채널',
      customUrl: '@idea',
      description: '아이디어를 찾는 채널',
      subscriberCount: 2000,
      hiddenSubscriberCount: false,
      totalVideoCount: 100,
      totalViewCount: 1000000,
      avgViewCount: 10000,
      url: 'https://www.youtube.com/channel/channel-1',
    }],
    lastQuery: '바이브 코딩',
    loading: false,
    nextPageToken: 'next',
    notice: '1개 채널을 찾았습니다. 결과는 아직 등록되지 않았습니다.',
    runSearch: vi.fn(),
    selectedIds: ['channel-1'],
    toggleSelected: vi.fn(),
  })),
}));

import YoutubeChannelSearchPanel from './YoutubeChannelSearchPanel';

describe('YoutubeChannelSearchPanel', () => {
  it('separates temporary API results from registration and explains comparison metrics', () => {
    const html = renderToStaticMarkup(<YoutubeChannelSearchPanel onPrepareChannelRegistration={vi.fn()} />);
    expect(html).toContain('키워드로 YouTube 채널 찾기');
    expect(html).toContain('자동 등록하거나 Azure DB에 저장하지 않습니다');
    expect(html).toContain('비교 중 1개 채널');
    expect(html).toContain('최근 성장률을 뜻하지 않습니다');
    expect(html).toContain('등록 검토하기');
    expect(html).toContain('다음 채널 12개 찾기');
    expect(html).toContain('채널의 운영 국가 제한이 아닙니다');
    expect(html).toContain('일본에서 시청 가능 · 일본어 우선');
  });

  it('marks a channel already present in the channel registry', () => {
    const html = renderToStaticMarkup(<YoutubeChannelSearchPanel registeredChannelIds={['channel-1']} onPrepareChannelRegistration={vi.fn()} />);
    expect(html).toContain('등록됨');
    expect(html).toContain('이미 등록된 채널');
  });
});
