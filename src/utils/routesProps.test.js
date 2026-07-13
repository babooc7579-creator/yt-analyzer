import { describe, expect, it } from 'vitest';

import {
  buildRoutesProps,
  getComingSoonViewProps,
} from './routesProps';

describe('routesProps utils', () => {
  it('builds route props from the current view flags and route data', () => {
    const activeCreatorItem = { id: 'today' };
    const channelWatchlistRouteProps = { channels: [] };
    const discoveryLinksRouteProps = { links: [] };
    const homeRouteProps = { selectedChannelCount: 2 };
    const legacyWorkspaceRouteProps = { totalVideoCount: 3 };
    const ttoTtoRouteProps = { videos: [] };

    const props = buildRoutesProps({
      activeCreatorItem,
      channelWatchlistRouteProps,
      discoveryLinksRouteProps,
      homeRouteProps,
      isComingSoonView: false,
      isChannelWatchlistView: true,
      isDiscoveryLinksView: true,
      isHomeView: false,
      isLegacyWorkspaceView: false,
      isTtoTtoView: true,
      legacyWorkspaceRouteProps,
      ttoTtoRouteProps,
    });

    expect(props).toMatchObject({
      activeCreatorItem,
      channelWatchlistRouteProps,
      discoveryLinksRouteProps,
      homeRouteProps,
      isComingSoonView: false,
      isChannelWatchlistView: true,
      isDiscoveryLinksView: true,
      isHomeView: false,
      isLegacyWorkspaceView: false,
      isTtoTtoView: true,
      legacyWorkspaceRouteProps,
      ttoTtoRouteProps,
    });
  });

  it('forwards the home navigation handler without invoking it', () => {
    const onOpenHome = () => 'home';

    const props = buildRoutesProps({
      onOpenHome,
    });

    expect(props.onOpenHome).toBe(onOpenHome);
  });

  it('builds coming soon screen copy without implying data work', () => {
    const props = getComingSoonViewProps({
      item: {
        label: '설정',
      },
    });

    expect(props).toMatchObject({
      backButtonAriaLabel: '오늘의 레이더로 돌아가기, 데이터 조회나 저장 작업 없음',
      backButtonLabel: '오늘의 레이더로 돌아가기',
      title: '설정 준비중',
    });
    expect(props.noticeText).toContain('아직 연결되지 않은 설계 자리');
    expect(props.noticeText).toContain('새 API 호출');
    expect(props.noticeText).toContain('localStorage 삭제');
    expect(props.backButtonTitle).toContain('저장 작업은 실행하지 않습니다');
  });

  it('uses a safe coming soon title when the menu item is missing', () => {
    const props = getComingSoonViewProps();

    expect(props.title).toBe('선택한 메뉴 준비중');
    expect(props.noticeText).toContain('연결되지 않은');
    expect(props.noticeText).toContain('DB 변경');
  });
});
