import { beforeEach, describe, expect, it, vi } from 'vitest';

const workspaceMocks = vi.hoisted(() => {
  const topComments = {
    closeTopCommentsModal: vi.fn(),
    commentModal: { isOpen: false, videoId: null },
    fetchTopComments: vi.fn(),
  };

  const navigation = {
    activeCreatorItem: { id: 'today' },
    activeTab: 'channels',
    creatorView: 'home',
    isComingSoonView: false,
    isDiscoveryLinksView: false,
    isHomeView: true,
    isLegacyWorkspaceView: false,
    isReferenceVaultView: false,
    openCreatorView: vi.fn(),
    setActiveTab: vi.fn(),
    setShowWorkPanel: vi.fn(),
    showWorkPanel: true,
  };

  const discoveryWorkflow = {
    addDiscoveryLink: vi.fn(),
    changeDiscoveryLink: vi.fn(),
    discoveryLinks: [{ id: 'link-1' }],
    discoveryLinksError: '',
    discoveryLinksLoading: false,
    discoveryLinksNotice: '저장됨',
    discoveryLinksSaving: false,
    discoveryLinksSavingMessage: '',
    loadDiscoveryLinks: vi.fn(),
    removeDiscoveryLink: vi.fn(),
  };

  return {
    discoveryWorkflow,
    navigation,
    topComments,
  };
});

vi.mock('./useCreatorWorkspaceNavigation', () => ({
  useCreatorWorkspaceNavigation: vi.fn(() => workspaceMocks.navigation),
}));

vi.mock('./useCreatorAppDiscoveryWorkflow', () => ({
  useCreatorAppDiscoveryWorkflow: vi.fn(() => workspaceMocks.discoveryWorkflow),
}));

vi.mock('./useTopComments', () => ({
  useTopComments: vi.fn(() => workspaceMocks.topComments),
}));

import { useCreatorAppDiscoveryWorkflow } from './useCreatorAppDiscoveryWorkflow';
import { useCreatorAppWorkspaceWorkflow } from './useCreatorAppWorkspaceWorkflow';
import { useCreatorWorkspaceNavigation } from './useCreatorWorkspaceNavigation';
import { useTopComments } from './useTopComments';

describe('useCreatorAppWorkspaceWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('combines navigation, discovery links, and top comment tools', () => {
    const setError = vi.fn();

    const workflow = useCreatorAppWorkspaceWorkflow({
      apiKey: 'youtube-api-key',
      setError,
    });

    expect(useTopComments).toHaveBeenCalledWith({
      apiKey: 'youtube-api-key',
      onError: setError,
    });
    expect(useCreatorWorkspaceNavigation).toHaveBeenCalledTimes(1);
    expect(useCreatorAppDiscoveryWorkflow).toHaveBeenCalledTimes(1);
    expect(workflow).toEqual({
      activeCreatorItem: workspaceMocks.navigation.activeCreatorItem,
      activeTab: workspaceMocks.navigation.activeTab,
      addDiscoveryLink: workspaceMocks.discoveryWorkflow.addDiscoveryLink,
      changeDiscoveryLink: workspaceMocks.discoveryWorkflow.changeDiscoveryLink,
      closeTopCommentsModal: workspaceMocks.topComments.closeTopCommentsModal,
      commentModal: workspaceMocks.topComments.commentModal,
      creatorView: workspaceMocks.navigation.creatorView,
      discoveryLinks: workspaceMocks.discoveryWorkflow.discoveryLinks,
      discoveryLinksError: workspaceMocks.discoveryWorkflow.discoveryLinksError,
      discoveryLinksLoading: workspaceMocks.discoveryWorkflow.discoveryLinksLoading,
      discoveryLinksNotice: workspaceMocks.discoveryWorkflow.discoveryLinksNotice,
      discoveryLinksSaving: workspaceMocks.discoveryWorkflow.discoveryLinksSaving,
      discoveryLinksSavingMessage: workspaceMocks.discoveryWorkflow.discoveryLinksSavingMessage,
      fetchTopComments: workspaceMocks.topComments.fetchTopComments,
      isComingSoonView: workspaceMocks.navigation.isComingSoonView,
      isDiscoveryLinksView: workspaceMocks.navigation.isDiscoveryLinksView,
      isHomeView: workspaceMocks.navigation.isHomeView,
      isLegacyWorkspaceView: workspaceMocks.navigation.isLegacyWorkspaceView,
      isReferenceVaultView: workspaceMocks.navigation.isReferenceVaultView,
      loadDiscoveryLinks: workspaceMocks.discoveryWorkflow.loadDiscoveryLinks,
      openCreatorView: workspaceMocks.navigation.openCreatorView,
      removeDiscoveryLink: workspaceMocks.discoveryWorkflow.removeDiscoveryLink,
      setActiveTab: workspaceMocks.navigation.setActiveTab,
      setShowWorkPanel: workspaceMocks.navigation.setShowWorkPanel,
      showWorkPanel: workspaceMocks.navigation.showWorkPanel,
    });
  });
});
