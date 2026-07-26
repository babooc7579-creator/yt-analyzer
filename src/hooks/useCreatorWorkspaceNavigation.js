import { useState } from 'react';
import {
  getCreatorWorkspaceNavigationState,
  getCreatorWorkspaceViewModel,
  normalizeCreatorWorkspaceItem,
} from '../utils/creatorWorkspaceNavigation';

export function useCreatorWorkspaceNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWorkPanel, setShowWorkPanel] = useState(false);
  const [creatorView, setCreatorView] = useState('home');
  const [creatorViewIntent, setCreatorViewIntent] = useState(null);
  const [hasUnsavedProductionDrafts, setHasUnsavedProductionDrafts] = useState(false);

  const {
    activeCreatorItem,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isScriptBoardView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
  } = getCreatorWorkspaceViewModel(creatorView);

  const openCreatorView = (item) => {
    const normalizedItem = normalizeCreatorWorkspaceItem(item);
    const nextState = getCreatorWorkspaceNavigationState({
      activeTab,
      itemId: normalizedItem.id,
      showWorkPanel,
    });
    const nextIntent = normalizedItem?.intent && typeof normalizedItem.intent === 'object'
      ? normalizedItem.intent
      : null;

    setCreatorView(nextState.creatorView);
    setCreatorViewIntent(nextIntent);
    setActiveTab(nextState.activeTab);
    setShowWorkPanel(nextState.showWorkPanel);
  };

  return {
    activeCreatorItem,
    activeTab,
    creatorView,
    creatorViewIntent,
    hasUnsavedProductionDrafts,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isScriptBoardView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    openCreatorView,
    setActiveTab,
    setHasUnsavedProductionDrafts,
    setShowWorkPanel,
    showWorkPanel,
  };
}
