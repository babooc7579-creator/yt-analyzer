import {
  buildChannelWatchlistRouteProps,
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
  buildTtoTtoRouteProps,
} from '../utils/appRouteProps';

export function useCreatorAppViewProps(props) {
  const channelWatchlistRouteProps = buildChannelWatchlistRouteProps(props);
  const layoutProps = buildLayoutProps(props);
  const homeRouteProps = buildHomeRouteProps(props);
  const discoveryLinksRouteProps = buildDiscoveryLinksRouteProps(props);
  const legacyWorkspaceRouteProps = buildLegacyWorkspaceRouteProps(props);
  const ttoTtoRouteProps = buildTtoTtoRouteProps(props);

  const routesProps = buildRoutesProps({
    activeCreatorItem: props.activeCreatorItem,
    channelWatchlistRouteProps,
    discoveryLinksRouteProps,
    homeRouteProps,
    isComingSoonView: props.isComingSoonView,
    isChannelWatchlistView: props.isChannelWatchlistView,
    isDiscoveryLinksView: props.isDiscoveryLinksView,
    isHomeView: props.isHomeView,
    isLegacyWorkspaceView: props.isLegacyWorkspaceView,
    isTtoTtoView: props.isTtoTtoView,
    legacyWorkspaceRouteProps,
    onOpenHome: () => props.openCreatorView({ id: 'home' }),
    ttoTtoRouteProps,
  });

  return {
    layoutProps,
    routesProps,
  };
}
