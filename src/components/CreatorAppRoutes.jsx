import CreatorComingSoonRoute from './CreatorComingSoonRoute';
import CreatorChannelWatchlistRoute from './CreatorChannelWatchlistRoute';
import CreatorDiscoveryLinksRoute from './CreatorDiscoveryLinksRoute';
import CreatorHomeRoute from './CreatorHomeRoute';
import CreatorLegacyWorkspaceRoute from './CreatorLegacyWorkspaceRoute';
import CreatorTtoTtoRoute from './CreatorTtoTtoRoute';

export default function CreatorAppRoutes({
  activeCreatorItem,
  channelWatchlistRouteProps,
  discoveryLinksRouteProps,
  homeRouteProps,
  isComingSoonView,
  isChannelWatchlistView,
  isDiscoveryLinksView,
  isHomeView,
  isLegacyWorkspaceView,
  isTtoTtoView,
  legacyWorkspaceRouteProps,
  onOpenHome,
  ttoTtoRouteProps,
}) {
  if (isHomeView) {
    return <CreatorHomeRoute {...homeRouteProps} />;
  }

  if (isComingSoonView) {
    return <CreatorComingSoonRoute item={activeCreatorItem} onOpenHome={onOpenHome} />;
  }

  if (isDiscoveryLinksView) {
    return <CreatorDiscoveryLinksRoute {...discoveryLinksRouteProps} />;
  }

  if (isChannelWatchlistView) {
    return <CreatorChannelWatchlistRoute {...channelWatchlistRouteProps} />;
  }

  if (isTtoTtoView) {
    return <CreatorTtoTtoRoute {...ttoTtoRouteProps} />;
  }

  if (isLegacyWorkspaceView) {
    return <CreatorLegacyWorkspaceRoute {...legacyWorkspaceRouteProps} />;
  }

  return null;
}
