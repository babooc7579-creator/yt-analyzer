import { useState } from 'react';
import {
  getCreatorWorkspaceNavigationState,
  getCreatorWorkspaceViewModel,
} from '../utils/creatorWorkspaceNavigation';

export function useCreatorWorkspaceNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWorkPanel, setShowWorkPanel] = useState(false);
  const [creatorView, setCreatorView] = useState('home');

  const {
    activeCreatorItem,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isTtoTtoView,
  } = getCreatorWorkspaceViewModel(creatorView);

  const openCreatorView = (item) => {
    const nextState = getCreatorWorkspaceNavigationState({
      activeTab,
      itemId: item.id,
      showWorkPanel,
    });

    setCreatorView(nextState.creatorView);
    setActiveTab(nextState.activeTab);
    setShowWorkPanel(nextState.showWorkPanel);
  };

  return {
    activeCreatorItem,
    activeTab,
    creatorView,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isTtoTtoView,
    openCreatorView,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  };
}
