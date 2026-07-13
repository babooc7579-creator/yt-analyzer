import { useState } from 'react';
import {
  getCreatorWorkspaceNavigationState,
  getCreatorWorkspaceViewModel,
} from '../utils/creatorWorkspaceNavigation';

export function useCreatorWorkspaceNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWorkPanel, setShowWorkPanel] = useState(false);
  const [creatorView, setCreatorView] = useState('home');
  const [creatorViewIntent, setCreatorViewIntent] = useState(null);

  const {
    activeCreatorItem,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
  } = getCreatorWorkspaceViewModel(creatorView);

  const openCreatorView = (item) => {
    const nextState = getCreatorWorkspaceNavigationState({
      activeTab,
      itemId: item.id,
      showWorkPanel,
    });
    const nextIntent = item?.intent && typeof item.intent === 'object'
      ? item.intent
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
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    openCreatorView,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  };
}
