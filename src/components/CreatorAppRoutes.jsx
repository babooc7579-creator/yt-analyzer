import { lazy, Suspense, useCallback, useState } from 'react';
import { readKeywordExplorerSession, writeKeywordExplorerSession } from '../utils/keywordExplorerSessionStorage';
import CreatorHomeRoute from './CreatorHomeRoute';
import CreatorLegacyWorkspaceRoute from './CreatorLegacyWorkspaceRoute';
import LazyRouteErrorBoundary from './LazyRouteErrorBoundary';

const CreatorComingSoonRoute = lazy(() => import('./CreatorComingSoonRoute'));
const CreatorChannelWatchlistRoute = lazy(() => import('./CreatorChannelWatchlistRoute'));
const CreatorDiscoveryLinksRoute = lazy(() => import('./CreatorDiscoveryLinksRoute'));
const CreatorKeywordExplorerRoute = lazy(() => import('./CreatorKeywordExplorerRoute'));
const CreatorImprovementLogRoute = lazy(() => import('./CreatorImprovementLogRoute'));
const RecentScanStatusWorkspace = lazy(() => import('./RecentScanStatusWorkspace'));
const CreatorScriptBoardRoute = lazy(() => import('./CreatorScriptBoardRoute'));
const CreatorSettingsRoute = lazy(() => import('./CreatorSettingsRoute'));
const CreatorTagVaultRoute = lazy(() => import('./CreatorTagVaultRoute'));
const CreatorTtoTtoRoute = lazy(() => import('./CreatorTtoTtoRoute'));
const CreatorUploadCalendarRoute = lazy(() => import('./CreatorUploadCalendarRoute'));
const WorkToolsWorkspace = lazy(() => import('./WorkToolsWorkspace'));

const withRouteLoading = (route) => (
  <LazyRouteErrorBoundary>
    <Suspense
      fallback={(
        <div
          className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-8 text-center text-sm font-semibold text-slate-300"
          role="status"
        >
          선택한 화면을 불러오는 중입니다...
        </div>
      )}
    >
      {route}
    </Suspense>
  </LazyRouteErrorBoundary>
);

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
  isRecentScanStatusView,
  isScriptBoardView,
  isSettingsView,
  isTagVaultView,
  isTtoTtoView,
  isUploadCalendarView,
  isWorkToolsView,
  keywordExplorerRouteProps,
  legacyWorkspaceRouteProps,
  recentScanStatusRouteProps,
  onOpenHome,
  scriptBoardRouteProps,
  settingsRouteProps,
  ttoTtoRouteProps,
  tagVaultRouteProps,
  uploadCalendarRouteProps,
  workToolsRouteProps,
}) {
  const [keywordExplorerSession, setKeywordExplorerSession] = useState(() => readKeywordExplorerSession());
  const updateKeywordExplorerSession = useCallback((key, value) => {
    setKeywordExplorerSession((current) => {
      if (current[key] === value) return current;
      const nextSession = { ...current, [key]: value };
      writeKeywordExplorerSession(nextSession);
      return nextSession;
    });
  }, []);

  if (isHomeView) {
    return <CreatorHomeRoute {...homeRouteProps} />;
  }

  if (activeCreatorItem?.id === 'insight-notes') {
    return withRouteLoading(<CreatorImprovementLogRoute />);
  }

  if (isKeywordExplorerView) {
    return withRouteLoading(
      <CreatorKeywordExplorerRoute
        {...keywordExplorerRouteProps}
        keywordExplorerSession={keywordExplorerSession}
        onKeywordExplorerSessionChange={updateKeywordExplorerSession}
      />,
    );
  }

  if (isTagVaultView) {
    return withRouteLoading(<CreatorTagVaultRoute {...tagVaultRouteProps} />);
  }

  if (isUploadCalendarView) {
    return withRouteLoading(<CreatorUploadCalendarRoute {...uploadCalendarRouteProps} />);
  }

  if (isScriptBoardView) {
    return withRouteLoading(<CreatorScriptBoardRoute {...scriptBoardRouteProps} />);
  }

  if (isSettingsView) {
    return withRouteLoading(<CreatorSettingsRoute {...settingsRouteProps} />);
  }

  if (isWorkToolsView) {
    return withRouteLoading(<WorkToolsWorkspace {...workToolsRouteProps} />);
  }

  if (isRecentScanStatusView) {
    return withRouteLoading(<RecentScanStatusWorkspace {...recentScanStatusRouteProps} />);
  }

  if (isComingSoonView) {
    return withRouteLoading(
      <CreatorComingSoonRoute item={activeCreatorItem} onOpenHome={onOpenHome} />,
    );
  }

  if (isDiscoveryLinksView) {
    return withRouteLoading(<CreatorDiscoveryLinksRoute {...discoveryLinksRouteProps} />);
  }

  if (isChannelWatchlistView) {
    return withRouteLoading(<CreatorChannelWatchlistRoute {...channelWatchlistRouteProps} />);
  }

  if (isTtoTtoView) {
    return withRouteLoading(<CreatorTtoTtoRoute {...ttoTtoRouteProps} />);
  }

  if (isLegacyWorkspaceView) {
    return <CreatorLegacyWorkspaceRoute {...legacyWorkspaceRouteProps} />;
  }

  return null;
}
