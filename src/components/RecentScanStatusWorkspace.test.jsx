import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import RecentScanStatusWorkspace, {
  RecentScanHistoryEmptyState,
  RecentScanHistoryLogRow,
  ScanIssueGuidance,
} from './RecentScanStatusWorkspace';

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
          {
            id: 'partial',
            title: '과거 보강 채널',
            lastScanSummary: {
              status: 'partial',
              scannedAt: '2026-07-26T11:00:00.000Z',
              savedVideosTotal: 200,
              channelTotalVideos: 400,
              estimatedMissingVideos: 200,
            },
          },
        ]}
      />,
    );

    expect(html).toContain('채널별 최근 수집 상태');
    expect(html).toContain('Cloud에 저장된 과거 수집 이력');
    expect(html).toContain('확인 필요 채널');
    expect(html).toContain('YouTube API 사용 한도');
    expect(html).toContain('기술 오류 원문 보기');
    expect(html).toContain('quota warning');
    expect(html).toContain('새 영상 2개 · 통계 갱신 5개');
    expect(html).toContain('이 채널 관리');
    expect(html).toContain('다시 수집 준비');
    expect((html.match(/다시 수집 준비/g) || []).length).toBe(1);
    expect(html).toContain('과거 영상 100개까지 채우기');
    expect(html).toContain('자동 반복·예약·전체 채널 실행은 하지 않습니다');
    expect(html).toContain('이 화면은 Cloud DB만 조회합니다');
    expect(html).toContain('과거 수집 이력');
    expect(html).toContain('Cloud 수집 이력을 불러오는 중입니다');
  });

  it('renders an honest empty state when no channels exist', () => {
    const html = renderToStaticMarkup(<RecentScanStatusWorkspace channels={[]} />);

    expect(html).toContain('0개 채널 표시');
    expect(html).toContain('저장된 채널이 없습니다');
    expect(html).toContain('채널 운영실 열기');
  });

  it('does not report an empty channel list while Cloud channels are loading', () => {
    const html = renderToStaticMarkup(
      <RecentScanStatusWorkspace channels={[]} channelsLoading />,
    );

    expect(html).toContain('Cloud 채널 상태 조회 중');
    expect(html).toContain('조회가 끝나기 전에는 채널이 없다고 판단하지 않습니다');
    expect(html).not.toContain('저장된 채널이 없습니다');
  });

  it('uses a Korean label for an unclassified channel grade', () => {
    const html = renderToStaticMarkup(
      <RecentScanStatusWorkspace channels={[{
        id: 'channel-1',
        title: '운영 채널',
        grade: 'unclassified',
      }]} />,
    );

    expect(html).toContain('등급 미분류');
    expect(html).not.toContain('등급 unclassified');
  });

  it('guides an empty history to channel selection before collection', () => {
    const html = renderToStaticMarkup(<RecentScanHistoryEmptyState />);

    expect(html).toContain('수집할 채널 고르기');
    expect(html).toContain('수집할 채널을 먼저 고릅니다');
    expect(html).toContain('선택만으로 YouTube API 수집은 시작되지 않습니다');
  });

  it('connects a history result to the matching channel management stage', () => {
    const html = renderToStaticMarkup(
      <RecentScanHistoryLogRow
        log={{
          channelId: 'channel-1',
          channelTitle: 'History Channel',
          error: 'quota warning',
          newVideosFound: 2,
          scannedAt: '2026-07-27T01:00:00.000Z',
          statsRefreshed: 5,
          status: 'partial',
        }}
      />,
    );

    expect(html).toContain('History Channel');
    expect(html).toContain('새 영상 2개 · 통계 갱신 5개');
    expect(html).toContain('quota warning');
    expect(html).toContain('채널 관리');
    expect(html).toContain('Cloud 저장이나 YouTube API 호출은 실행되지 않습니다');
  });

  it('explains partial coverage without promising that retry will backfill history', () => {
    const html = renderToStaticMarkup(
      <ScanIssueGuidance
        record={{
          status: 'partial',
          savedVideosTotal: 250,
          channelTotalVideos: 400,
          estimatedMissingVideos: 150,
          coverageRate: 62.5,
        }}
      />,
    );

    expect(html).toContain('과거 영상 저장 범위가 아직 부족합니다');
    expect(html).toContain('Cloud 저장 250개 / 채널 전체 400개');
    expect(html).toContain('과거 영상 100개까지 채우기');
    expect(html).not.toContain('기술 오류 원문 보기');
  });
});
