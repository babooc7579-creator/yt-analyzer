import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelWatchlistNextStep from './ChannelWatchlistNextStep';

describe('ChannelWatchlistNextStep', () => {
  it('shows the radar as the next step after stored videos load', () => {
    const html = renderToStaticMarkup(
      <ChannelWatchlistNextStep
        loadResult={{ success: true, videoCount: 27 }}
        onOpenRadar={() => {}}
        onOpenSelectedScan={() => {}}
      />,
    );

    expect(html).toContain('저장 영상 27개 불러오기 완료');
    expect(html).toContain('다음: 오늘의 레이더 보기');
    expect(html).toContain('이동만으로 API 호출이나 데이터 변경은 실행되지 않습니다.');
  });

  it('guides empty results to the separate collection screen', () => {
    const html = renderToStaticMarkup(
      <ChannelWatchlistNextStep
        loadResult={{ success: true, videoCount: 0 }}
        onOpenRadar={() => {}}
        onOpenSelectedScan={() => {}}
      />,
    );

    expect(html).toContain('선택 채널에 저장된 영상이 없습니다');
    expect(html).toContain('다음: 새 영상 수집 화면');
    expect(html).toContain('이동만으로 YouTube API 호출은 실행되지 않습니다.');
  });

  it('does not show a next step before a successful lookup', () => {
    expect(renderToStaticMarkup(
      <ChannelWatchlistNextStep
        loadResult={{ success: false, videoCount: 0 }}
        onOpenRadar={() => {}}
        onOpenSelectedScan={() => {}}
      />,
    )).toBe('');
  });
});
