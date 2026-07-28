import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeNextActionPanel from './HomeNextActionPanel';

describe('HomeNextActionPanel', () => {
  it('renders the next action impact text and safe button title', () => {
    const html = renderToStaticMarkup(
      <HomeNextActionPanel
        savedChannelCount={5}
        selectedChannelCount={2}
        loadedVideoCount={0}
        onLoadStoredVideos={() => 'load stored videos'}
      />,
    );

    expect(html).toContain('다음 추천 행동');
    expect(html).toContain('온라인 저장소(Azure DB) 조회입니다');
    expect(html).toContain('YouTube API 호출은 실행하지 않습니다');
    expect(html).toContain('수집 영상 목록 불러오기');
    expect(html).toContain('title="DB 조회: 선택 채널 2개의 수집된 영상 정보를 불러옵니다. 새 YouTube API 호출은 없습니다."');
    expect(html).toContain('aria-label="DB 조회: 선택 채널 2개의 수집된 영상 정보를 불러옵니다. 새 YouTube API 호출은 없습니다."');
  });

  it('links directly to the candidate stage when review items are waiting', () => {
    const html = renderToStaticMarkup(
      <HomeNextActionPanel
        savedChannelCount={5}
        selectedChannelCount={2}
        loadedVideoCount={10}
        openRadarCandidateCount={3}
      />,
    );

    expect(html).toContain('아래 후보 카드에서 누른 판단 버튼만 온라인 저장소(Azure DB)의 판단 기록에 저장됩니다');
    expect(html).toContain('3개 남음');
    expect(html).toContain('href="#today-radar-candidates"');
    expect(html).toContain('후보 판정 시작');
    expect(html).toContain('이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 실행되지 않습니다');
    expect(html).not.toContain('<button');
  });

  it('renders rights-warning candidates as the next action after radar review is done', () => {
    const html = renderToStaticMarkup(
      <HomeNextActionPanel
        discoveryCandidateCount={4}
        discoveryRightsWarningCount={2}
        savedChannelCount={5}
        selectedChannelCount={2}
        loadedVideoCount={10}
        openRadarCandidateCount={0}
        productionCandidateCount={1}
        onOpenProductionCandidates={() => 'open production candidates'}
      />,
    );

    expect(html).toContain('권리 확인 필요한 후보를 먼저 정리하세요');
    expect(html).toContain('권리 확인 2개');
    expect(html).toContain('후보함에서 확인');
    expect(html).toContain('저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다');
    expect(html).toContain('권리 상태 변경은 후보함이나 발견함에서 직접 선택할 때 온라인 저장소(Azure DB)에 저장됩니다');
  });

  it('renders both recovery paths after a successful zero-video lookup', () => {
    const html = renderToStaticMarkup(
      <HomeNextActionPanel
        savedChannelCount={5}
        selectedChannelCount={2}
        loadedVideoCount={0}
        storedVideoLoadResult={{ success: true, videoCount: 0 }}
        onOpenChannelWatchlist={() => 'open channels'}
        onOpenSelectedScan={() => 'open scan'}
      />,
    );

    expect(html).toContain('선택한 채널에는 수집된 영상 정보가 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 화면 열기');
    expect(html).toContain('이동만으로 수집은 실행되지 않으며');
  });
});
