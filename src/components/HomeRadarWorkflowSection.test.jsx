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
        savedChannelCount={5}
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('오늘 레이더');
    expect(html).toContain('선택 채널 2개 저장 영상 불러오기, DB 조회이며 YouTube API 호출 없음');
    expect(html).toContain('Cloud DB');
    expect(html).toContain('YouTube API');
    expect(html).toContain('제작 후보함');
    expect(html).toContain('발견함');
  });
});
