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
    expect(html).toContain('Cloud DB 조회입니다');
    expect(html).toContain('YouTube API 호출은 실행하지 않습니다');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('title="DB 조회: 선택 채널 2개의 저장된 영상을 불러옵니다. 새 YouTube API 호출은 없습니다."');
    expect(html).toContain('aria-label="DB 조회: 선택 채널 2개의 저장된 영상을 불러옵니다. 새 YouTube API 호출은 없습니다."');
  });

  it('does not render an action button when the next step is reviewing visible candidates', () => {
    const html = renderToStaticMarkup(
      <HomeNextActionPanel
        savedChannelCount={5}
        selectedChannelCount={2}
        loadedVideoCount={10}
        openRadarCandidateCount={3}
      />,
    );

    expect(html).toContain('아래 후보 카드에서 누른 판단 버튼만 Cloud 판단 기록에 저장됩니다');
    expect(html).toContain('3개 남음');
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
    expect(html).toContain('권리 상태 변경은 후보함이나 발견함에서 직접 선택할 때 Cloud에 저장됩니다');
  });
});
