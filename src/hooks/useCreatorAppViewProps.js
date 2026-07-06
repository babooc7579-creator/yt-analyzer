import {
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
} from '../utils/appRouteProps';

export function useCreatorAppViewProps(props) {
  const layoutProps = buildLayoutProps(props);
  const homeRouteProps = buildHomeRouteProps(props);
  const discoveryLinksRouteProps = buildDiscoveryLinksRouteProps(props);
  const legacyWorkspaceRouteProps = buildLegacyWorkspaceRouteProps(props);

  const routesProps = buildRoutesProps({
    activeCreatorItem: props.activeCreatorItem,
    discoveryLinksRouteProps,
    homeRouteProps,
    isComingSoonView: props.isComingSoonView,
    isDiscoveryLinksView: props.isDiscoveryLinksView,
    isHomeView: props.isHomeView,
    isLegacyWorkspaceView: props.isLegacyWorkspaceView,
    legacyWorkspaceRouteProps,
    onOpenHome: () => props.openCreatorView({ id: 'home' }),
  });

  return {
    layoutProps,
    routesProps,
  };
}
