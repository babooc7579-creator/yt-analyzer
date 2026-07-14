import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarCandidateEmptyState from './RadarCandidateEmptyState';

const noop = () => {};

describe('RadarCandidateEmptyState', () => {
  it('guides an empty selection to the channel watchlist without implying an API call', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateEmptyState
        onLoadStoredVideos={noop}
        onOpenChannelWatchlist={noop}
        onOpenVault={noop}
        selectedChannelCount={0}
      />,
    );

    expect(html).toContain('오늘 볼 채널 고르기');
    expect(html).toContain('채널 선택만으로 YouTube API를 호출하지 않습니다');
    expect(html).toContain('disabled=""');
  });

  it('offers Cloud stored-video lookup after channels are selected', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateEmptyState
        onLoadStoredVideos={noop}
        onOpenChannelWatchlist={noop}
        onOpenVault={noop}
        selectedChannelCount={3}
      />,
    );

    expect(html).toContain('선택한 채널 3개');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).not.toContain('오늘 볼 채널 고르기');
    expect(html).not.toContain('disabled=""');
  });

  it('does not render a broken channel action when its callback is unavailable', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateEmptyState
        onLoadStoredVideos={noop}
        onOpenVault={noop}
        selectedChannelCount={0}
      />,
    );

    expect(html).toContain('아직 선택한 채널이 없습니다');
    expect(html).not.toContain('오늘 볼 채널 고르기</button>');
    expect(html).toContain('레퍼런스 금고 열기');
  });

  it('replaces the retry button with channel and scan paths after a successful empty lookup', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateEmptyState
        onLoadStoredVideos={noop}
        onOpenChannelWatchlist={noop}
        onOpenSelectedScan={noop}
        onOpenVault={noop}
        selectedChannelCount={2}
        storedVideoLoadResult={{ success: true, videoCount: 0 }}
      />,
    );

    expect(html).toContain('조회는 정상적으로 끝났지만 저장된 영상이 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 준비');
    expect(html).not.toContain('>저장 영상 불러오기</button>');
  });
});
