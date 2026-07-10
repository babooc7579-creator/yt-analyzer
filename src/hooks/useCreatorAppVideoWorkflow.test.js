import { beforeEach, describe, expect, it, vi } from 'vitest';

const videoWorkflowMocks = vi.hoisted(() => {
  const reviewWorkflow = {
    clearRadarDecisions: vi.fn(),
    isProductionCandidate: vi.fn(),
    isVideoSaved: vi.fn(),
    markRadarVideoStatus: vi.fn(),
    promoteVideoToProduction: vi.fn(),
    restoreVideoToRadar: vi.fn(),
    savedVideos: [{ videoId: 'video-1' }],
    scrapbookSyncWarning: '',
    toggleScrapVideo: vi.fn(),
    updateVideoUserRecord: vi.fn(),
    videoRecordsSyncWarning: '',
    videoUserRecords: {
      'video-1': { statusIds: ['production_candidate'] },
    },
  };

  const explorerState = {
    filteredAndSortedVideos: [{ videoId: 'video-1' }],
    lengthFilter: 'all',
    searchKeyword: 'army',
    setLengthFilter: vi.fn(),
    setSearchKeyword: vi.fn(),
    setSortType: vi.fn(),
    setTtoTtoMode: vi.fn(),
    setViewFilter: vi.fn(),
    setViewMode: vi.fn(),
    sortType: 'views',
    ttoTtoMode: true,
    viewFilter: 'all',
    viewMode: 'cards',
  };

  const selection = {
    checkedVideos: ['video-1'],
    clearCheckedVideos: vi.fn(),
    copiedPrompt: '복사 완료',
    copyPromptForVideos: vi.fn(),
    promptCopyError: '',
    toggleCheckVideo: vi.fn(),
  };

  return {
    explorerState,
    reviewWorkflow,
    selection,
  };
});

vi.mock('./useCreatorAppVideoReviewWorkflow', () => ({
  useCreatorAppVideoReviewWorkflow: vi.fn(() => videoWorkflowMocks.reviewWorkflow),
}));

vi.mock('./useVideoExplorerState', () => ({
  useVideoExplorerState: vi.fn(() => videoWorkflowMocks.explorerState),
}));

vi.mock('./useVideoSelection', () => ({
  useVideoSelection: vi.fn(() => videoWorkflowMocks.selection),
}));

import { useCreatorAppVideoReviewWorkflow } from './useCreatorAppVideoReviewWorkflow';
import { useCreatorAppVideoWorkflow } from './useCreatorAppVideoWorkflow';
import { useVideoExplorerState } from './useVideoExplorerState';
import { useVideoSelection } from './useVideoSelection';

describe('useCreatorAppVideoWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('combines video review, explorer state, and selection tools', () => {
    const videos = [{ videoId: 'video-1' }];

    const workflow = useCreatorAppVideoWorkflow({ videos });

    expect(useCreatorAppVideoReviewWorkflow).toHaveBeenCalledTimes(1);
    expect(useVideoExplorerState).toHaveBeenCalledWith(videos);
    expect(useVideoSelection).toHaveBeenCalledTimes(1);
    expect(workflow).toEqual({
      checkedVideos: videoWorkflowMocks.selection.checkedVideos,
      clearCheckedVideos: videoWorkflowMocks.selection.clearCheckedVideos,
      clearRadarDecisions: videoWorkflowMocks.reviewWorkflow.clearRadarDecisions,
      copiedPrompt: videoWorkflowMocks.selection.copiedPrompt,
      copyPromptForVideos: videoWorkflowMocks.selection.copyPromptForVideos,
      filteredAndSortedVideos: videoWorkflowMocks.explorerState.filteredAndSortedVideos,
      isProductionCandidate: videoWorkflowMocks.reviewWorkflow.isProductionCandidate,
      isVideoSaved: videoWorkflowMocks.reviewWorkflow.isVideoSaved,
      lengthFilter: videoWorkflowMocks.explorerState.lengthFilter,
      markRadarVideoStatus: videoWorkflowMocks.reviewWorkflow.markRadarVideoStatus,
      promoteVideoToProduction: videoWorkflowMocks.reviewWorkflow.promoteVideoToProduction,
      promptCopyError: videoWorkflowMocks.selection.promptCopyError,
      restoreVideoToRadar: videoWorkflowMocks.reviewWorkflow.restoreVideoToRadar,
      savedVideos: videoWorkflowMocks.reviewWorkflow.savedVideos,
      scrapbookSyncWarning: videoWorkflowMocks.reviewWorkflow.scrapbookSyncWarning,
      searchKeyword: videoWorkflowMocks.explorerState.searchKeyword,
      setLengthFilter: videoWorkflowMocks.explorerState.setLengthFilter,
      setSearchKeyword: videoWorkflowMocks.explorerState.setSearchKeyword,
      setSortType: videoWorkflowMocks.explorerState.setSortType,
      setTtoTtoMode: videoWorkflowMocks.explorerState.setTtoTtoMode,
      setViewFilter: videoWorkflowMocks.explorerState.setViewFilter,
      setViewMode: videoWorkflowMocks.explorerState.setViewMode,
      sortType: videoWorkflowMocks.explorerState.sortType,
      toggleCheckVideo: videoWorkflowMocks.selection.toggleCheckVideo,
      toggleScrapVideo: videoWorkflowMocks.reviewWorkflow.toggleScrapVideo,
      ttoTtoMode: videoWorkflowMocks.explorerState.ttoTtoMode,
      updateVideoUserRecord: videoWorkflowMocks.reviewWorkflow.updateVideoUserRecord,
      videoRecordsSyncWarning: videoWorkflowMocks.reviewWorkflow.videoRecordsSyncWarning,
      videoUserRecords: videoWorkflowMocks.reviewWorkflow.videoUserRecords,
      viewFilter: videoWorkflowMocks.explorerState.viewFilter,
      viewMode: videoWorkflowMocks.explorerState.viewMode,
    });
  });
});
