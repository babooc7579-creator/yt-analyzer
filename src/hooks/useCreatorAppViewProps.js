import {
  buildChannelWatchlistRouteProps,
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildKeywordExplorerRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
  buildTagVaultRouteProps,
  buildTtoTtoRouteProps,
  buildUploadCalendarRouteProps,
} from '../utils/appRouteProps';

export function useCreatorAppViewProps(props) {
  const channelWatchlistRouteProps = buildChannelWatchlistRouteProps(props);
  const layoutProps = buildLayoutProps(props);
  const homeRouteProps = buildHomeRouteProps(props);
  const discoveryLinksRouteProps = buildDiscoveryLinksRouteProps(props);
  const keywordExplorerRouteProps = buildKeywordExplorerRouteProps(props);
  const legacyWorkspaceRouteProps = buildLegacyWorkspaceRouteProps(props);
  const tagVaultRouteProps = buildTagVaultRouteProps(props);
  const ttoTtoRouteProps = buildTtoTtoRouteProps(props);
  const uploadCalendarRouteProps = buildUploadCalendarRouteProps(props);

  const routesProps = buildRoutesProps({
    activeCreatorItem: props.activeCreatorItem,
    channelWatchlistRouteProps,
    discoveryLinksRouteProps,
    homeRouteProps,
    isComingSoonView: props.isComingSoonView,
    isChannelWatchlistView: props.isChannelWatchlistView,
    isDiscoveryLinksView: props.isDiscoveryLinksView,
    isHomeView: props.isHomeView,
    isKeywordExplorerView: props.isKeywordExplorerView,
    isLegacyWorkspaceView: props.isLegacyWorkspaceView,
    isTagVaultView: props.isTagVaultView,
    isTtoTtoView: props.isTtoTtoView,
    isUploadCalendarView: props.isUploadCalendarView,
    keywordExplorerRouteProps,
    legacyWorkspaceRouteProps,
    onOpenHome: () => props.openCreatorView({ id: 'home' }),
    ttoTtoRouteProps,
    tagVaultRouteProps,
    uploadCalendarRouteProps,
  });

  return {
    layoutProps,
    routesProps,
  };
}
