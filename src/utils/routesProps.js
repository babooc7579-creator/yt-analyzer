export function buildRoutesProps({
  activeCreatorItem,
  discoveryLinksRouteProps,
  homeRouteProps,
  isComingSoonView,
  isDiscoveryLinksView,
  isHomeView,
  isLegacyWorkspaceView,
  legacyWorkspaceRouteProps,
  onOpenHome,
}) {
  return {
    activeCreatorItem,
    discoveryLinksRouteProps,
    homeRouteProps,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    legacyWorkspaceRouteProps,
    onOpenHome,
  };
}

export const getComingSoonViewProps = ({ item } = {}) => {
  const itemLabel = item?.label || '선택한 메뉴';

  return {
    backButtonAriaLabel: '오늘의 레이더로 돌아가기, 데이터 조회나 저장 작업 없음',
    backButtonLabel: '오늘의 레이더로 돌아가기',
    backButtonTitle: '오늘의 레이더로 돌아갑니다. 데이터 조회나 저장 작업은 실행하지 않습니다.',
    noticeText: '이 화면은 아직 연결되지 않은 설계 자리입니다. 클릭해도 새 API 호출, DB 변경, localStorage 삭제가 발생하지 않습니다.',
    title: `${itemLabel} 준비중`,
  };
};
