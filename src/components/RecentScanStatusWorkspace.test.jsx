import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import RecentScanStatusWorkspace from './RecentScanStatusWorkspace';

describe('RecentScanStatusWorkspace', () => {
  it('renders latest-only operational status without implying history or quota accuracy', () => {
    const html = renderToStaticMarkup(
      <RecentScanStatusWorkspace
        channels={[
          {
            id: 'failed',
            title: '확인 필요 채널',
            lastScanSummary: {
              status: 'failed',
              scannedAt: '2026-07-26T09:00:00.000Z',
              error: 'quota warning',
            },
          },
          {
            id: 'success',
            title: '정상 채널',
            lastScanSummary: {
              status: 'success',
              scannedAt: '2026-07-26T10:00:00.000Z',
              newVideosFound: 2,
              statsRefreshed: 5,
            },
          },
        ]}
      />,
    );

    expect(html).toContain('채널별 최근 수집 상태');
    expect(html).toContain('과거 이력이나 정확한 YouTube API 쿼터 장부는 아직 포함하지 않습니다');
    expect(html).toContain('확인 필요 채널');
    expect(html).toContain('quota warning');
    expect(html).toContain('새 영상 2개 · 통계 갱신 5개');
    expect(html).toContain('이 화면을 열거나 필터링해도 YouTube API 호출과 Cloud 저장은 실행되지 않습니다');
  });

  it('renders an honest empty state when no channels exist', () => {
    const html = renderToStaticMarkup(<RecentScanStatusWorkspace channels={[]} />);

    expect(html).toContain('0개 채널 표시');
    expect(html).toContain('조건에 맞는 채널이 없습니다');
    expect(html).toContain('검색·필터 초기화');
  });
});
