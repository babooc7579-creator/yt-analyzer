import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import RecentScanStatusWorkspace from './RecentScanStatusWorkspace';

describe('RecentScanStatusWorkspace', () => {
  it('renders latest operational status and the Cloud history boundary', () => {
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
    expect(html).toContain('Cloud에 저장된 과거 수집 이력');
    expect(html).toContain('확인 필요 채널');
    expect(html).toContain('quota warning');
    expect(html).toContain('새 영상 2개 · 통계 갱신 5개');
    expect(html).toContain('이 화면은 Cloud DB만 조회합니다');
    expect(html).toContain('과거 수집 이력');
    expect(html).toContain('Cloud 수집 이력을 불러오는 중입니다');
  });

  it('renders an honest empty state when no channels exist', () => {
    const html = renderToStaticMarkup(<RecentScanStatusWorkspace channels={[]} />);

    expect(html).toContain('0개 채널 표시');
    expect(html).toContain('조건에 맞는 채널이 없습니다');
    expect(html).toContain('검색·필터 초기화');
  });
});
