import CreatorComingSoonRoute from './CreatorComingSoonRoute';
import CreatorChannelWatchlistRoute from './CreatorChannelWatchlistRoute';
import CreatorDiscoveryLinksRoute from './CreatorDiscoveryLinksRoute';
import CreatorHomeRoute from './CreatorHomeRoute';
import CreatorKeywordExplorerRoute from './CreatorKeywordExplorerRoute';
import CreatorLegacyWorkspaceRoute from './CreatorLegacyWorkspaceRoute';
import CreatorScriptBoardRoute from './CreatorScriptBoardRoute';
import CreatorSettingsRoute from './CreatorSettingsRoute';
import CreatorTagVaultRoute from './CreatorTagVaultRoute';
import CreatorTtoTtoRoute from './CreatorTtoTtoRoute';
import CreatorUploadCalendarRoute from './CreatorUploadCalendarRoute';

export default function CreatorAppRoutes({
  activeCreatorItem,
  channelWatchlistRouteProps,
  discoveryLinksRouteProps,
  homeRouteProps,
  isComingSoonView,
  isChannelWatchlistView,
  isDiscoveryLinksView,
  isHomeView,
  isKeywordExplorerView,
  isLegacyWorkspaceView,
  isScriptBoardView,
  isSettingsView,
  isTagVaultView,
  isTtoTtoView,
  isUploadCalendarView,
  keywordExplorerRouteProps,
  legacyWorkspaceRouteProps,
  onOpenHome,
  scriptBoardRouteProps,
  settingsRouteProps,
  ttoTtoRouteProps,
  tagVaultRouteProps,
  uploadCalendarRouteProps,
}) {
  if (isHomeView) {
    return <CreatorHomeRoute {...homeRouteProps} />;
  }

  if (isKeywordExplorerView) {
    return <CreatorKeywordExplorerRoute {...keywordExplorerRouteProps} />;
  }

  if (isTagVaultView) {
    return <CreatorTagVaultRoute {...tagVaultRouteProps} />;
  }

  if (isUploadCalendarView) {
    return <CreatorUploadCalendarRoute {...uploadCalendarRouteProps} />;
  }

  if (isScriptBoardView) {
    return <CreatorScriptBoardRoute {...scriptBoardRouteProps} />;
  }

  if (isSettingsView) {
    return <CreatorSettingsRoute {...settingsRouteProps} />;
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
