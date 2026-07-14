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
    expect(html).toContain('채널 이름 또는 태그 검색');
    expect(html).toContain('채널 검색어 지우기');
    expect(html).toContain('분야 전체');
    expect(html).toContain('등급 전체');
    expect(html).toContain('수집일 전체');
    expect(html).toContain('랭킹 연구소');
    expect(html).toContain('오늘 선택');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
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
    expect(html).toContain('후보 판정 시작');
    expect(html).toContain('#today-radar-candidates');
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
    expect(html).toContain('새 영상 수집 준비');
  });
});
