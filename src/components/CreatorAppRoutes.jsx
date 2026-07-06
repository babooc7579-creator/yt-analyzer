import CreatorComingSoonRoute from './CreatorComingSoonRoute';
import CreatorDiscoveryLinksRoute from './CreatorDiscoveryLinksRoute';
import CreatorHomeRoute from './CreatorHomeRoute';
import CreatorLegacyWorkspaceRoute from './CreatorLegacyWorkspaceRoute';

export default function CreatorAppRoutes({
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
  if (isHomeView) {
    return <CreatorHomeRoute {...homeRouteProps} />;
  }

  if (isComingSoonView) {
    return <CreatorComingSoonRoute item={activeCreatorItem} onOpenHome={onOpenHome} />;
  }

  if (isDiscoveryLinksView) {
    return <CreatorDiscoveryLinksRoute {...discoveryLinksRouteProps} />;
  }

  if (isLegacyWorkspaceView) {
    return <CreatorLegacyWorkspaceRoute {...legacyWorkspaceRouteProps} />;
  }

  return null;
}
