import { beforeEach, describe, expect, it, vi } from 'vitest';

const controllerMocks = vi.hoisted(() => {
  const runtime = {
    apiKey: 'test-api-key',
    setError: vi.fn(),
    setLoading: vi.fn(),
    setProgressMsg: vi.fn(),
    setUpdatingChannelId: vi.fn(),
    videos: [{ videoId: 'video-1' }],
  };

  const channelWorkflow = {
    categories: ['해외'],
    savedChannels: [{ id: 'channel-1' }],
    selectedChannelIds: ['channel-1'],
  };

  const videoWorkflow = {
    savedVideos: [{ videoId: 'video-1' }],
    scrapbookSyncWarning: '스크랩북 Cloud 연결 실패',
    videoRecordsSyncWarning: '판단 기록 Cloud 연결 실패',
    videoUserRecords: {
      'video-1': { statusIds: ['production_candidate'] },
    },
  };

  const workspaceWorkflow = {
    discoveryLinks: [{ id: 'link-1' }],
    setActiveTab: vi.fn(),
  };

  const collectionWorkflow = {
    loadStoredVideos: vi.fn(),
    scanSelectedChannels: vi.fn(),
  };

  const derivedState = {
    syncWarnings: ['Cloud 연결 실패로 임시 기록 표시 중'],
    todayCandidateCount: 1,
  };

  const viewProps = {
    layoutProps: { shell: 'layout' },
    routesProps: { routes: 'creator-os' },
  };

  return {
    channelWorkflow,
    collectionWorkflow,
    derivedState,
    runtime,
    videoWorkflow,
    viewProps,
    workspaceWorkflow,
  };
});

vi.mock('./useAppRuntimeState', () => ({
  useAppRuntimeState: vi.fn(() => controllerMocks.runtime),
}));

vi.mock('./useCreatorAppChannelWorkflow', () => ({
  useCreatorAppChannelWorkflow: vi.fn(() => controllerMocks.channelWorkflow),
}));

vi.mock('./useCreatorAppCollectionWorkflow', () => ({
  useCreatorAppCollectionWorkflow: vi.fn(() => controllerMocks.collectionWorkflow),
}));

vi.mock('./useCreatorAppDerivedState', () => ({
  useCreatorAppDerivedState: vi.fn(() => controllerMocks.derivedState),
}));

vi.mock('./useCreatorAppVideoWorkflow', () => ({
  useCreatorAppVideoWorkflow: vi.fn(() => controllerMocks.videoWorkflow),
}));

vi.mock('./useCreatorAppViewProps', () => ({
  useCreatorAppViewProps: vi.fn(() => controllerMocks.viewProps),
}));

vi.mock('./useCreatorAppWorkspaceWorkflow', () => ({
  useCreatorAppWorkspaceWorkflow: vi.fn(() => controllerMocks.workspaceWorkflow),
}));

import { useAppRuntimeState } from './useAppRuntimeState';
import { useCreatorAppChannelWorkflow } from './useCreatorAppChannelWorkflow';
import { useCreatorAppCollectionWorkflow } from './useCreatorAppCollectionWorkflow';
import { useCreatorAppController } from './useCreatorAppController';
import { useCreatorAppDerivedState } from './useCreatorAppDerivedState';
import { useCreatorAppVideoWorkflow } from './useCreatorAppVideoWorkflow';
import { useCreatorAppViewProps } from './useCreatorAppViewProps';
import { useCreatorAppWorkspaceWorkflow } from './useCreatorAppWorkspaceWorkflow';

describe('useCreatorAppController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('wires runtime, workflows, derived state, and view props in order', () => {
    const result = useCreatorAppController();

    expect(useAppRuntimeState).toHaveBeenCalledTimes(1);
    expect(useCreatorAppChannelWorkflow).toHaveBeenCalledWith({
      setError: controllerMocks.runtime.setError,
      setLoading: controllerMocks.runtime.setLoading,
      setProgressMsg: controllerMocks.runtime.setProgressMsg,
      setUpdatingChannelId: controllerMocks.runtime.setUpdatingChannelId,
    });
    expect(useCreatorAppVideoWorkflow).toHaveBeenCalledWith({
      videos: controllerMocks.runtime.videos,
    });
    expect(useCreatorAppWorkspaceWorkflow).toHaveBeenCalledWith({
      apiKey: controllerMocks.runtime.apiKey,
      setError: controllerMocks.runtime.setError,
    });
    expect(useCreatorAppCollectionWorkflow).toHaveBeenCalledWith({
      channelWorkflow: controllerMocks.channelWorkflow,
      runtime: controllerMocks.runtime,
      videoWorkflow: controllerMocks.videoWorkflow,
      workspaceWorkflow: controllerMocks.workspaceWorkflow,
    });
    expect(useCreatorAppDerivedState).toHaveBeenCalledWith({
      categories: controllerMocks.channelWorkflow.categories,
      discoveryLinks: controllerMocks.workspaceWorkflow.discoveryLinks,
      savedChannels: controllerMocks.channelWorkflow.savedChannels,
      savedVideos: controllerMocks.videoWorkflow.savedVideos,
      scrapbookSyncWarning: controllerMocks.videoWorkflow.scrapbookSyncWarning,
      selectedChannelIds: controllerMocks.channelWorkflow.selectedChannelIds,
      videoRecordsSyncWarning: controllerMocks.videoWorkflow.videoRecordsSyncWarning,
      videoUserRecords: controllerMocks.videoWorkflow.videoUserRecords,
      videos: controllerMocks.runtime.videos,
    });
    expect(useCreatorAppViewProps).toHaveBeenCalledWith({
      ...controllerMocks.runtime,
      ...controllerMocks.channelWorkflow,
      ...controllerMocks.videoWorkflow,
      ...controllerMocks.workspaceWorkflow,
      ...controllerMocks.collectionWorkflow,
      ...controllerMocks.derivedState,
    });
    expect(result).toBe(controllerMocks.viewProps);
  });
});
