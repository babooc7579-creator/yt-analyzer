import { useState } from 'react';
import {
  CHANNEL_CREATOR_VIEWS,
  READY_CREATOR_VIEWS,
  REFERENCE_VAULT_VIEWS,
  SCRAPBOOK_CREATOR_VIEWS,
  getCreatorOsItem,
} from '../constants/creatorOs';

export function useCreatorWorkspaceNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWorkPanel, setShowWorkPanel] = useState(false);
  const [creatorView, setCreatorView] = useState('home');

  const activeCreatorItem = getCreatorOsItem(creatorView);
  const isHomeView = creatorView === 'home';
  const isComingSoonView = activeCreatorItem?.status === 'soon';
  const isDiscoveryLinksView = creatorView === 'vault-sources';
  const isLegacyWorkspaceView = READY_CREATOR_VIEWS.includes(creatorView);
  const isReferenceVaultView = REFERENCE_VAULT_VIEWS.includes(creatorView);

  const openCreatorView = (item) => {
    setCreatorView(item.id);

    if (CHANNEL_CREATOR_VIEWS.includes(item.id)) {
      setActiveTab('dashboard');
      setShowWorkPanel(true);
      return;
    }

    if (SCRAPBOOK_CREATOR_VIEWS.includes(item.id)) {
      setActiveTab('scrapbook');
      setShowWorkPanel(false);
      return;
    }

    if (item.id === 'vault-all' || item.id === 'vault-videos') {
      setActiveTab('dashboard');
      setShowWorkPanel(false);
    }
  };

  return {
    activeCreatorItem,
    activeTab,
    creatorView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    openCreatorView,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  };
}
