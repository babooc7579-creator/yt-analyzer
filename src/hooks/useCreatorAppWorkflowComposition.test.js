import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./useCategories', () => ({
  useCategories: vi.fn(() => ({
    categories: ['해외', '예능'],
    setCategories: vi.fn(),
  })),
}));

vi.mock('./useChannelSelection', () => ({
  useChannelSelection: vi.fn(() => ({
    selectedCategoryTab: '해외',
    selectedChannelIds: ['channel-1'],
    setSelectedCategoryTab: vi.fn(),
    setSelectedChannelIds: vi.fn(),
  })),
}));

vi.mock('./useChannelFormState', () => ({
  useChannelFormState: vi.fn(() => ({
    cancelRenameCategory: vi.fn(),
    renameValue: '해외 레퍼런스',
    renamingCategory: '해외',
    setRenameLoading: vi.fn(),
  })),
}));

vi.mock('./useCloudChannels', () => ({
  useCloudChannels: vi.fn(() => ({
    loadChannelsFromCloud: vi.fn(),
    savedChannels: [{ id: 'channel-1' }],
    setSavedChannels: vi.fn(),
  })),
}));

vi.mock('./useChannelActions', () => ({
  useChannelActions: vi.fn(() => ({
    deleteChannel: vi.fn(),
    saveChannel: vi.fn(),
    saveChannelNote: vi.fn(),
  })),
}));

vi.mock('./useCreatorAppChannelAddWorkflow', () => ({
  useCreatorAppChannelAddWorkflow: vi.fn(() => ({
    handleBulkAdd: vi.fn(),
    handleSaveChannel: vi.fn(),
  })),
}));

vi.mock('./useChannelNotesModal', () => ({
  useChannelNotesModal: vi.fn(() => ({
    addChannelNote: vi.fn(),
    notesModal: { isOpen: false },
  })),
}));

vi.mock('./useCreatorAppChannelRenameWorkflow', () => ({
  useCreatorAppChannelRenameWorkflow: vi.fn(() => ({
    confirmRenameCategory: vi.fn(),
  })),
}));

vi.mock('./useVideoCollectionActions', () => ({
  useVideoCollectionActions: vi.fn(() => ({
    loadStoredVideos: vi.fn(),
    scanSelectedChannels: vi.fn(),
  })),
}));

vi.mock('./useDiscoveryLinks', () => ({
  useDiscoveryLinks: vi.fn(() => ({
    addDiscoveryLink: vi.fn(),
    discoveryLinks: [{ id: 'link-1' }],
  })),
}));

vi.mock('./useScrapbook', () => ({
  useScrapbook: vi.fn(() => ({
    isVideoSaved: vi.fn(),
    savedVideos: [{ videoId: 'video-1' }],
    scrapbookSyncWarning: '',
    toggleScrapVideo: vi.fn(),
  })),
}));

vi.mock('./useVideoUserRecords', () => ({
  useVideoUserRecords: vi.fn(() => ({
    clearRadarDecisions: vi.fn(),
    markVideoStatus: vi.fn(),
    restoreVideoToRadar: vi.fn(),
    updateVideoUserRecord: vi.fn(),
    videoRecordsSyncWarning: '',
    videoUserRecords: { 'video-1': { statusIds: ['production_candidate'] } },
  })),
}));

vi.mock('./useVideoProductionActions', () => ({
  useVideoProductionActions: vi.fn(() => ({
    isProductionCandidate: vi.fn(),
    promoteVideoToProduction: vi.fn(),
  })),
}));

import { useCategories } from './useCategories';
import { useChannelActions } from './useChannelActions';
import { useChannelFormState } from './useChannelFormState';
import { useChannelNotesModal } from './useChannelNotesModal';
import { useChannelSelection } from './useChannelSelection';
import { useCloudChannels } from './useCloudChannels';
import { useCreatorAppChannelAddWorkflow } from './useCreatorAppChannelAddWorkflow';
import { useCreatorAppChannelRenameWorkflow } from './useCreatorAppChannelRenameWorkflow';
import { useCreatorAppChannelWorkflow } from './useCreatorAppChannelWorkflow';
import { useCreatorAppCollectionWorkflow } from './useCreatorAppCollectionWorkflow';
import { useCreatorAppDiscoveryWorkflow } from './useCreatorAppDiscoveryWorkflow';
import { useCreatorAppVideoReviewWorkflow } from './useCreatorAppVideoReviewWorkflow';
import { useDiscoveryLinks } from './useDiscoveryLinks';
import { useScrapbook } from './useScrapbook';
import { useVideoCollectionActions } from './useVideoCollectionActions';
import { useVideoProductionActions } from './useVideoProductionActions';
import { useVideoUserRecords } from './useVideoUserRecords';

describe('Creator app workflow composition hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('wires the channel workflow around Cloud channels, channel actions, notes, and rename flows', () => {
    const setError = vi.fn();
    const setLoading = vi.fn();
    const setProgressMsg = vi.fn();
    const setUpdatingChannelId = vi.fn();

    const workflow = useCreatorAppChannelWorkflow({
      setError,
      setLoading,
      setProgressMsg,
      setUpdatingChannelId,
    });

    const categoryState = useCategories.mock.results[0].value;
    const channelSelection = useChannelSelection.mock.results[0].value;
    const formState = useChannelFormState.mock.results[0].value;
    const cloudChannels = useCloudChannels.mock.results[0].value;
    const channelActions = useChannelActions.mock.results[0].value;

    expect(useChannelSelection).toHaveBeenCalledWith('해외');
    expect(useCloudChannels).toHaveBeenCalledWith({ onError: setError });
    expect(useChannelActions).toHaveBeenCalledWith({
      setSavedChannels: cloudChannels.setSavedChannels,
      setSelectedChannelIds: channelSelection.setSelectedChannelIds,
      setUpdatingChannelId,
      setError,
    });
    expect(useCreatorAppChannelAddWorkflow).toHaveBeenCalledWith({
      channelActions,
      channelSelection,
      cloudChannels,
      formState,
      setError,
      setLoading,
      setProgressMsg,
    });
    expect(useChannelNotesModal).toHaveBeenCalledWith({
      saveChannelNote: channelActions.saveChannelNote,
      onError: setError,
    });
    expect(useCreatorAppChannelRenameWorkflow).toHaveBeenCalledWith({
      categoryState,
      channelSelection,
      cloudChannels,
      formState,
      setError,
      setProgressMsg,
    });
    expect(workflow).toEqual(expect.objectContaining({
      categories: categoryState.categories,
      savedChannels: cloudChannels.savedChannels,
      selectedChannelIds: channelSelection.selectedChannelIds,
      notesModal: { isOpen: false },
      confirmRenameCategory: expect.any(Function),
      handleSaveChannel: expect.any(Function),
      saveChannel: channelActions.saveChannel,
    }));
  });

  it('passes collection workflow dependencies to the video collection actions hook', () => {
    const channelWorkflow = {
      loadChannelsFromCloud: vi.fn(),
      savedChannels: [{ id: 'channel-1' }],
      selectedChannelIds: ['channel-1'],
    };
    const runtime = {
      setError: vi.fn(),
      setIsScanning: vi.fn(),
      setLoading: vi.fn(),
      setProgressMsg: vi.fn(),
      setScanningTag: vi.fn(),
      setVideos: vi.fn(),
    };
    const videoWorkflow = {
      clearCheckedVideos: vi.fn(),
    };
    const workspaceWorkflow = {
      setActiveTab: vi.fn(),
    };

    const workflow = useCreatorAppCollectionWorkflow({
      channelWorkflow,
      runtime,
      videoWorkflow,
      workspaceWorkflow,
    });

    expect(useVideoCollectionActions).toHaveBeenCalledWith({
      clearCheckedVideos: videoWorkflow.clearCheckedVideos,
      loadChannelsFromCloud: channelWorkflow.loadChannelsFromCloud,
      savedChannels: channelWorkflow.savedChannels,
      selectedChannelIds: channelWorkflow.selectedChannelIds,
      setActiveTab: workspaceWorkflow.setActiveTab,
      setError: runtime.setError,
      setIsScanning: runtime.setIsScanning,
      setLoading: runtime.setLoading,
      setProgressMsg: runtime.setProgressMsg,
      setScanningTag: runtime.setScanningTag,
      setVideos: runtime.setVideos,
    });
    expect(workflow).toEqual({
      loadStoredVideos: expect.any(Function),
      scanSelectedChannels: expect.any(Function),
    });
  });

  it('keeps the discovery workflow as the Cloud discovery links hook result', () => {
    const workflow = useCreatorAppDiscoveryWorkflow();

    expect(useDiscoveryLinks).toHaveBeenCalledTimes(1);
    expect(workflow).toEqual({
      addDiscoveryLink: expect.any(Function),
      discoveryLinks: [{ id: 'link-1' }],
    });
  });

  it('wires scrapbook and video user records into video production actions', () => {
    const workflow = useCreatorAppVideoReviewWorkflow();
    const scrapbook = useScrapbook.mock.results[0].value;
    const videoUserRecords = useVideoUserRecords.mock.results[0].value;
    const productionActions = useVideoProductionActions.mock.results[0].value;

    expect(useVideoProductionActions).toHaveBeenCalledWith({
      isVideoSaved: scrapbook.isVideoSaved,
      markVideoStatus: videoUserRecords.markVideoStatus,
      toggleScrapVideo: scrapbook.toggleScrapVideo,
      videoUserRecords: videoUserRecords.videoUserRecords,
    });
    expect(workflow).toEqual(expect.objectContaining({
      clearRadarDecisions: videoUserRecords.clearRadarDecisions,
      isProductionCandidate: productionActions.isProductionCandidate,
      isVideoSaved: scrapbook.isVideoSaved,
      markRadarVideoStatus: videoUserRecords.markVideoStatus,
      promoteVideoToProduction: productionActions.promoteVideoToProduction,
      savedVideos: scrapbook.savedVideos,
      scrapbookSyncWarning: scrapbook.scrapbookSyncWarning,
      toggleScrapVideo: scrapbook.toggleScrapVideo,
      updateVideoUserRecord: videoUserRecords.updateVideoUserRecord,
      videoRecordsSyncWarning: videoUserRecords.videoRecordsSyncWarning,
      videoUserRecords: videoUserRecords.videoUserRecords,
    }));
  });
});
