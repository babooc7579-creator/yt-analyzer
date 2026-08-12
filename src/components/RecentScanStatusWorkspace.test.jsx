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
            backfillState: {
              inspectionProgressRate: 25,
              videosInspectedTotal: 100,
              lastRun: {
                coverageRate: 50,
                savedVideosTotal: 200,
                channelTotalVideos: 400,
                estimatedMissingVideos: 200,
              },
            },
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
    expect(html).toContain('온라인 저장소(Azure DB)에 저장된 과거 수집 이력');
    expect(html).toContain('확인 필요 채널');
    expect(html).toContain('YouTube API 사용 한도');
    expect(html).toContain('기술 오류 원문 보기');
    expect(html).toContain('quota warning');
    expect(html).toContain('새 영상 2개 · 통계 갱신 5개');
    expect(html).toContain('이 채널 관리');
    expect((html.match(/다시 수집 화면 열기/g) || []).length).toBe(1);
    expect(html).toContain('한 번에 최대 500개이며');
    expect(html).toContain('과거 목록 확인 25%');
    expect(html).toContain('이어서 과거 영상 수집');
    expect(html).toContain('업로드 목록 확인 25%');
    expect(html).toContain('100/400개 확인');
    expect(html).toContain('온라인 저장소(Azure DB) 저장 50%');
    expect(html).toContain('수집과 API 사용 기준');
    expect(html).toContain('현재 화면 조회');
    expect(html).toContain('채널을 고른 뒤 수집 버튼을 직접 실행할 때만 YouTube API를 사용');
    expect(html).toContain('앱에는 아직 정확한 쿼터 장부가 없습니다');
    expect(html).toContain('Google Cloud Console을 최종 기준');
    expect(html).toContain('이 과거 목록 수집 버튼은 자동 반복·예약·전체 채널 일괄 실행을 하지 않습니다');
    expect(html).toContain('“예약 수집”은 최신 영상 확인을 위한 별도 실행 기록입니다');
    expect(html).toContain('이 화면은 온라인 저장소(Azure DB)만 조회합니다');
    expect(html).toContain('과거 수집 이력');
    expect(html).toContain('온라인 저장소(Azure DB)의 수집 이력을 불러오는 중입니다');
    expect(html).toContain('이 채널 수집 화면 열기');
    expect(html).toContain('과거 목록 확인 상태');
    expect(html).toContain('과거 수집 전체');
    expect(html).toContain('확인 전');
    expect(html).toContain('진행 중');
    expect(html).toContain('확인 완료');
    expect(html).toContain('필터 변경은 화면 표시만 바꿉니다');
    expect(html).toContain('추천 순서:');
    expect(html).toContain('다음 과거 수집 추천');
    expect(html).toContain('필터와 정렬 동시 적용');
    expect(html).toContain('남은 영상 많은 순');
    expect(html).toContain('최근 확인 순');
    expect(html).toContain('채널 이름 순');
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

    expect(html).toContain('온라인 저장소(Azure DB)의 채널 상태 조회 중');
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
    expect(html).toContain('온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 실행되지 않습니다');
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
    expect(html).toContain('온라인 저장소(Azure DB) 저장 250개 / 채널 전체 400개');
    expect(html).toContain('과거 영상 수집을 직접 시작하세요');
    expect(html).toContain('저장된 위치에서 이어집니다');
    expect(html).not.toContain('기술 오류 원문 보기');
  });

  it('shows completed Cloud coverage above channel statistics without exceeding 100 percent', () => {
    const html = renderToStaticMarkup(
      <RecentScanStatusWorkspace
        channels={[{
          id: 'completed',
          title: '완료 채널',
          backfillState: {
            completed: true,
            inspectionProgressRate: 100,
            videosInspectedTotal: 1019,
            lastRun: {
              coverageRate: 100.1,
              savedVideosTotal: 1018,
              channelTotalVideos: 1017,
            },
          },
          lastScanSummary: {
            status: 'success',
            scannedAt: '2026-07-27T10:00:00.000Z',
          },
        }]}
      />,
    );

    expect(html).toContain('온라인 저장소(Azure DB) 저장 100% · 1,018개 저장');
    expect(html).toContain('채널 통계보다 1개 많음');
    expect(html).toContain('1,019개 확인 · 채널 통계 1,017개');
    expect(html).toContain('삭제·비공개 영상과 집계 시점 차이');
    expect(html).not.toContain('온라인 저장소(Azure DB) 저장 100.1%');
  });
});
