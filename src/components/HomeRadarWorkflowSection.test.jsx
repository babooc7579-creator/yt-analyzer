import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeRadarWorkflowSection from './HomeRadarWorkflowSection';

const noop = () => {};

describe('HomeRadarWorkflowSection', () => {
  it('renders the home to radar to production candidate flow with clear API boundaries', () => {
    const html = renderToStaticMarkup(
      <HomeRadarWorkflowSection
        discoveryCandidateCount={2}
        discoveryRightsWarningCount={1}
        loadedVideoCount={12}
        onLoadStoredVideos={noop}
        onOpenAddChannel={noop}
        onOpenDiscoveryLinks={noop}
        onOpenProductionCandidates={noop}
        onOpenSelectedScan={noop}
        onOpenVault={noop}
        openRadarCandidateCount={4}
        productionCandidateCount={3}
        productionFocusCount={2}
        savedChannels={[
          { id: 'channel-1', title: '랭킹 연구소', category: '랭킹형', status: 'active', grade: 'S' },
          { id: 'channel-2', title: '영화 기록실', category: '영화', status: 'active', grade: 'A' },
        ]}
        savedChannelCount={5}
        selectedChannelIds={['channel-1', 'channel-2']}
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('오늘 작업 흐름');
    expect(html).toContain('오늘의 레이더 진행 단계');
    expect(html).toContain('오늘 흐름');
    expect(html).toContain('2/4 완료');
    expect(html).toContain('지금 할 일');
    expect(html).toContain('지금 할 일 · 오늘 후보 판단');
    expect(html).toContain('오늘 볼 채널 고르기');
    expect(html).toContain('제작 후보 결정');
    expect(html).toContain('STAGE 1–2');
    expect(html).toContain('채널 이름 또는 태그 검색');
    expect(html).toContain('오늘 선택');
    expect(html).toContain('수집 영상 목록 불러오기');
    expect(html).toContain('온라인 저장소(Azure DB)');
    expect(html).toContain('YouTube API');
  });

  it('shows the direct candidate-start action after stored videos are loaded', () => {
    const html = renderToStaticMarkup(
      <HomeRadarWorkflowSection
        discoveryCandidateCount={2}
        discoveryRightsWarningCount={1}
        loadedVideoCount={12}
        onLoadStoredVideos={noop}
        onOpenAddChannel={noop}
        onOpenDiscoveryLinks={noop}
        onOpenProductionCandidates={noop}
        onOpenSelectedScan={noop}
        onOpenVault={noop}
        openRadarCandidateCount={0}
        productionCandidateCount={3}
        productionFocusCount={2}
        savedChannels={[{ id: 'channel-1', title: '랭킹 연구소', status: 'active' }]}
        savedChannelCount={5}
        selectedChannelIds={['channel-1']}
        selectedChannelCount={1}
        storedVideoLoadResult={{ success: true, videoCount: 12 }}
      />,
    );

    expect(html).toContain('수집 영상 12개가 판정대에 준비됐습니다');
    expect(html).toContain('후보 판정 시작');
  });

  it('passes the loading lock to the channel stage', () => {
    const html = renderToStaticMarkup(
      <HomeRadarWorkflowSection
        onLoadStoredVideos={noop}
        savedChannels={[{ id: 'channel-1', title: '랭킹 연구소', status: 'active' }]}
        selectedChannelIds={['channel-1']}
        selectedChannelCount={1}
        storedVideoLoadPending
      />,
    );

    expect(html).toContain('온라인 저장소(Azure DB)에서 수집 영상을 불러오는 중입니다');
    expect(html).toContain('수집 영상 불러오는 중...');
  });
});
