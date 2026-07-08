import {
  CHANNEL_CREATOR_VIEWS,
  READY_CREATOR_VIEWS,
  REFERENCE_VAULT_VIEWS,
  SCRAPBOOK_CREATOR_VIEWS,
  getCreatorOsItem,
} from '../constants/creatorOs';

export const getCreatorWorkspaceViewModel = (creatorView) => {
  const activeCreatorItem = getCreatorOsItem(creatorView);

  return {
    activeCreatorItem,
    isComingSoonView: activeCreatorItem?.status === 'soon',
    isDiscoveryLinksView: creatorView === 'vault-sources',
    isHomeView: creatorView === 'home',
    isLegacyWorkspaceView: READY_CREATOR_VIEWS.includes(creatorView),
    isReferenceVaultView: REFERENCE_VAULT_VIEWS.includes(creatorView),
  };
};

export const getCreatorWorkspaceNavigationState = ({
  activeTab,
  itemId,
  showWorkPanel,
}) => {
  if (CHANNEL_CREATOR_VIEWS.includes(itemId)) {
    return {
      activeTab: 'dashboard',
      creatorView: itemId,
      showWorkPanel: true,
    };
  }

  if (SCRAPBOOK_CREATOR_VIEWS.includes(itemId)) {
    return {
      activeTab: 'scrapbook',
      creatorView: itemId,
      showWorkPanel: false,
    };
  }

  if (itemId === 'vault-all' || itemId === 'vault-videos') {
    return {
      activeTab: 'dashboard',
      creatorView: itemId,
      showWorkPanel: false,
    };
  }

  return {
    activeTab,
    creatorView: itemId,
    showWorkPanel,
  };
};
