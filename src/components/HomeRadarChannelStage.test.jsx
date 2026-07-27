import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeRadarChannelStage from './HomeRadarChannelStage';

const channels = [
  { id: 'channel-1', title: '랭킹 연구소', category: '랭킹형', status: 'active', grade: 'S' },
  { id: 'channel-2', title: '영화 기록실', category: '영화', status: 'active', grade: 'A' },
];

describe('HomeRadarChannelStage', () => {
  it('keeps channel choice and stored-video lookup in one stage', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        onLoadStoredVideos={() => {}}
        onOpenChannelWatchlist={() => {}}
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        toggleChannelSelection={() => {}}
      />,
    );

    expect(html).toContain('STAGE 1–2');
    expect(html).toContain('id="today-radar-channels"');
    expect(html).toContain('id="today-radar-load"');
    expect(html).toContain('채널 이름 또는 태그 검색');
    expect(html).toContain('채널 검색어 지우기');
    expect(html).toContain('aria-label="채널 이름 또는 태그 검색"');
    expect(html).toContain('aria-label="채널 검색어 지우기"');
    expect(html).toContain('분야 전체');
    expect(html).toContain('등급 전체');
    expect(html).toContain('수집일 전체');
    expect(html).toContain('랭킹 연구소');
    expect(html).toContain('오늘 선택');
    expect(html).toContain('브라우저를 새로고침하면 초기화됩니다');
    expect(html).toContain('영상 판단과 제작 후보 기록은 Cloud에 보존됩니다');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
    expect(html).toContain('전체 채널 선택 화면으로 이동, Cloud DB 조회 및 YouTube API 호출 없음');
  });

  it('shows a direct candidate action after stored videos load', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        storedVideoLoadResult={{ success: true, videoCount: 12 }}
      />,
    );

    expect(html).toContain('저장 영상 12개가 판정대에 준비됐습니다');
    expect(html).toContain('아래 STAGE 3에서 오늘의 후보를 바로 판단할 수 있습니다.');
    expect(html).not.toContain('아래 STAGE 2에서 오늘의 후보를 바로 판단할 수 있습니다.');
    expect(html).toContain('후보 판정 시작');
    expect(html).toContain('#today-radar-candidates');
    expect(html).toContain('오늘 후보 판정 영역으로 이동, Cloud 저장 및 YouTube API 호출 없음');
  });

  it('shows recovery without pretending an empty Cloud result is a failure', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        onOpenSelectedScan={() => {}}
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        storedVideoLoadResult={{ success: true, videoCount: 0 }}
      />,
    );

    expect(html).toContain('저장된 영상이 없는 채널 조합입니다');
    expect(html).toContain('새 영상 수집 단계로');
    expect(html).toContain('새 영상 수집 화면으로 이동, 이동만으로 YouTube API 호출 없음');
  });

  it('explains that opening channel registration does not save or collect data', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        onOpenAddChannel={() => {}}
        savedChannels={[]}
        selectedChannelIds={[]}
      />,
    );

    expect(html).toContain('첫 채널 등록하기');
    expect(html).toContain('새 채널 등록 화면으로 이동, 채널 저장 및 YouTube API 호출 없음');
  });

  it('does not present an empty channel list while the initial Cloud lookup is pending', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        channelsLoading
        savedChannels={[]}
        selectedChannelIds={[]}
      />,
    );

    expect(html).toContain('Cloud 채널 목록을 불러오는 중입니다');
    expect(html).toContain('저장된 채널 조회이며 YouTube API는 호출하지 않습니다');
    expect(html).not.toContain('먼저 소재를 찾을 채널이 필요합니다');
    expect(html).not.toContain('첫 채널 등록하기');
  });

  it('continues to candidate review after returning to radar with matching loaded videos', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        selectedLoadedVideoCount={8}
      />,
    );

    expect(html).toContain('저장 영상 8개가 판정대에 준비됐습니다');
    expect(html).toContain('후보 판정 시작');
  });

  it('shows an in-place loading state and blocks duplicate stored-video lookups', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        onLoadStoredVideos={() => {}}
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        storedVideoLoadPending
      />,
    );

    expect(html).toContain('Cloud DB에서 저장 영상을 불러오는 중입니다');
    expect(html).toContain('저장 영상 불러오는 중...');
    expect(html).toContain('disabled');
  });

  it('shows a retry action after a failed Cloud lookup', () => {
    const html = renderToStaticMarkup(
      <HomeRadarChannelStage
        onLoadStoredVideos={() => {}}
        savedChannels={channels}
        selectedChannelIds={['channel-1']}
        storedVideoLoadResult={{ success: false, videoCount: 0 }}
      />,
    );

    expect(html).toContain('저장 영상을 불러오지 못했습니다');
    expect(html).toContain('저장 영상 다시 불러오기');
  });
});
