import {
  buildChannelWatchlistRouteProps,
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildKeywordExplorerRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
  buildScriptBoardRouteProps,
  buildSettingsRouteProps,
  buildTagVaultRouteProps,
  buildTtoTtoRouteProps,
  buildUploadCalendarRouteProps,
  buildWorkToolsRouteProps,
} from '../utils/appRouteProps';

export function useCreatorAppViewProps(props) {
  const channelWatchlistRouteProps = buildChannelWatchlistRouteProps(props);
  const layoutProps = buildLayoutProps(props);
  const homeRouteProps = buildHomeRouteProps(props);
  const discoveryLinksRouteProps = buildDiscoveryLinksRouteProps(props);
  const keywordExplorerRouteProps = buildKeywordExplorerRouteProps(props);
  const legacyWorkspaceRouteProps = buildLegacyWorkspaceRouteProps(props);
  const scriptBoardRouteProps = buildScriptBoardRouteProps(props);
  const settingsRouteProps = buildSettingsRouteProps(props);
  const tagVaultRouteProps = buildTagVaultRouteProps(props);
  const ttoTtoRouteProps = buildTtoTtoRouteProps(props);
  const uploadCalendarRouteProps = buildUploadCalendarRouteProps(props);
  const workToolsRouteProps = buildWorkToolsRouteProps(props);

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
    isScriptBoardView: props.isScriptBoardView,
    isSettingsView: props.isSettingsView,
    isTagVaultView: props.isTagVaultView,
    isTtoTtoView: props.isTtoTtoView,
    isUploadCalendarView: props.isUploadCalendarView,
    isWorkToolsView: props.isWorkToolsView,
    keywordExplorerRouteProps,
    legacyWorkspaceRouteProps,
    onOpenHome: () => props.openCreatorView({ id: 'home' }),
    scriptBoardRouteProps,
    settingsRouteProps,
    ttoTtoRouteProps,
    tagVaultRouteProps,
    uploadCalendarRouteProps,
    workToolsRouteProps,
  });

  return {
    layoutProps,
    routesProps,
  };
}
