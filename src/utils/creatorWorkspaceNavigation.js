import {
  CHANNEL_CREATOR_VIEWS,
  READY_CREATOR_VIEWS,
  REFERENCE_VAULT_VIEWS,
  SCRAPBOOK_CREATOR_VIEWS,
  getCreatorOsItem,
} from '../constants/creatorOs';

const CHANNEL_OPERATION_STAGE_BY_VIEW = {
  'ops-add-channel': 'add',
  'ops-selected-scan': 'scan',
};

export const normalizeCreatorWorkspaceItem = (item = {}) => {
  const operationStage = CHANNEL_OPERATION_STAGE_BY_VIEW[item.id];
  if (!operationStage) return item;

  return {
    ...item,
    id: 'ops-channels',
    intent: {
      operationStage,
      ...(item.intent || {}),
    },
  };
};

export const getCreatorWorkspaceViewModel = (creatorView) => {
  const activeCreatorItem = getCreatorOsItem(creatorView);

  return {
    activeCreatorItem,
    isComingSoonView: activeCreatorItem?.status === 'soon',
    isChannelWatchlistView: creatorView === 'discovery-watchlist',
    isDiscoveryLinksView: creatorView === 'vault-sources',
    isHomeView: creatorView === 'home',
    isKeywordExplorerView: creatorView === 'discovery-keywords',
    isLegacyWorkspaceView: READY_CREATOR_VIEWS.includes(creatorView),
    isReferenceVaultView: REFERENCE_VAULT_VIEWS.includes(creatorView),
    isSettingsView: creatorView === 'ops-settings',
    isTagVaultView: creatorView === 'vault-tags',
    isTtoTtoView: creatorView === 'discovery-ttotto',
    isUploadCalendarView: creatorView === 'studio-calendar',
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
