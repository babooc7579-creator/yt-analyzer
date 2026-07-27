import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import StoredVideoLoadFeedback from './StoredVideoLoadFeedback';

const noop = () => {};

describe('StoredVideoLoadFeedback', () => {
  it('keeps a failed Cloud lookup visible with retry guidance', () => {
    const html = renderToStaticMarkup(
      <StoredVideoLoadFeedback
        loadResult={{ success: false, videoCount: 0 }}
        onRetry={noop}
      />,
    );

    expect(html).toContain('온라인 저장소(Azure DB)의 수집 영상 정보를 불러오지 못했습니다');
    expect(html).toContain('다시 불러오기');
    expect(html).toContain('YouTube API를 호출하지 않았습니다');
  });

  it('guides an empty successful lookup to channel choice or collection preparation', () => {
    const html = renderToStaticMarkup(
      <StoredVideoLoadFeedback
        loadResult={{ success: true, videoCount: 0 }}
        onOpenChannelWatchlist={noop}
        onOpenSelectedScan={noop}
      />,
    );

    expect(html).toContain('조회는 정상 완료됐지만 수집된 영상 정보가 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 준비');
    expect(html).toContain('화면 이동만으로 YouTube API를 호출하지 않습니다');
  });

  it('stays hidden before lookup and after videos are loaded', () => {
    expect(renderToStaticMarkup(<StoredVideoLoadFeedback />)).toBe('');
    expect(renderToStaticMarkup(
      <StoredVideoLoadFeedback loadResult={{ success: true, videoCount: 3 }} />,
    )).toBe('');
  });

  it('only renders actions that are available in the current screen', () => {
    const html = renderToStaticMarkup(
      <StoredVideoLoadFeedback
        loadResult={{ success: true, videoCount: 0 }}
        onOpenSelectedScan={noop}
      />,
    );

    expect(html).not.toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 준비');
  });
});
