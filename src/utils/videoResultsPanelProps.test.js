import { describe, expect, it } from 'vitest';

import {
  getReferenceVaultEmptyStateActions,
  getVideoFilterEmptyStateActions,
  getVideoResultsPanelViewProps,
} from './videoResultsPanelProps';

describe('videoResultsPanelProps utils', () => {
  const video = { videoId: 'video-1', title: 'First video' };
  const secondVideo = { videoId: 'video-2', title: 'Second video' };

  const baseHandlers = {
    isProductionCandidate: (videoId) => videoId === 'video-2',
    isVideoSaved: (videoId) => videoId === 'video-1',
    onFetchComments: () => 'comments',
    onPromoteToProduction: () => 'promote',
    onToggleCheck: () => 'check',
    onToggleScrap: () => 'scrap',
  };

  it('builds safe video result lists and table props', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: ['video-1'],
      filteredVideos: [video],
      showWorkPanel: false,
      videos: [video, secondVideo],
    });

    expect(props.checkedVideoList).toEqual(['video-1']);
    expect(props.filteredVideoList).toEqual([video]);
    expect(props.videoList).toEqual([video, secondVideo]);
    expect(props.listTableProps).toMatchObject({
      videos: [video],
      checkedVideos: ['video-1'],
      isVideoSaved: baseHandlers.isVideoSaved,
      isProductionCandidate: baseHandlers.isProductionCandidate,
      toggleCheckVideo: baseHandlers.onToggleCheck,
      toggleScrapVideo: baseHandlers.onToggleScrap,
      promoteVideoToProduction: baseHandlers.onPromoteToProduction,
      fetchTopComments: baseHandlers.onFetchComments,
    });
  });

  it('builds card props with rank and current video status flags', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: ['video-1'],
      filteredVideos: [video, secondVideo],
      showWorkPanel: true,
      videos: [video, secondVideo],
    });

    expect(props.getVideoCardProps(video, 0)).toMatchObject({
      video,
      rank: 1,
      isChecked: true,
      isSaved: true,
      isProductionCandidate: false,
      showWorkPanel: true,
      onToggleCheck: baseHandlers.onToggleCheck,
      onToggleScrap: baseHandlers.onToggleScrap,
      onPromoteToProduction: baseHandlers.onPromoteToProduction,
      onFetchComments: baseHandlers.onFetchComments,
    });

    expect(props.getVideoCardProps(secondVideo, 1)).toMatchObject({
      video: secondVideo,
      rank: 2,
      isChecked: false,
      isSaved: false,
      isProductionCandidate: true,
    });
  });

  it('uses empty arrays when incoming video lists are invalid', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: null,
      filteredVideos: undefined,
      showWorkPanel: false,
      videos: 'not-list',
    });

    expect(props.checkedVideoList).toEqual([]);
    expect(props.filteredVideoList).toEqual([]);
    expect(props.videoList).toEqual([]);
    expect(props.listTableProps.videos).toEqual([]);
    expect(props.listTableProps.checkedVideos).toEqual([]);
  });

  it('keeps all videos separate from filtered videos for empty-state decisions', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: [],
      filteredVideos: [],
      showWorkPanel: false,
      videos: [video],
    });

    expect(props.videoList).toEqual([video]);
    expect(props.filteredVideoList).toEqual([]);
    expect(props.listTableProps.videos).toEqual([]);
  });

  it('builds reference vault empty-state navigation actions without scan or save side effects', () => {
    const onOpenChannelWatchlist = () => 'open channel watchlist';
    const onOpenHome = () => 'open home';

    const actions = getReferenceVaultEmptyStateActions({
      onOpenChannelWatchlist,
      onOpenHome,
    });

    expect(actions).toHaveLength(2);
    expect(actions.map(action => action.key)).toEqual(['channel-watchlist', 'home']);
    expect(actions[0]).toMatchObject({
      iconKey: 'channel-watchlist',
      label: '오늘 볼 채널 선택',
      onClick: onOpenChannelWatchlist,
    });
    expect(actions[1]).toMatchObject({
      iconKey: 'home',
      label: '오늘 레이더로',
      onClick: onOpenHome,
    });
    expect(actions[0].title).toContain('조회, 저장, 새 영상 수집 또는 YouTube API 호출은 실행하지 않습니다');
    expect(actions[1].title).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('omits reference vault actions when navigation handlers are unavailable', () => {
    expect(getReferenceVaultEmptyStateActions()).toEqual([]);
    expect(getReferenceVaultEmptyStateActions({ onOpenHome: () => 'home' })).toHaveLength(1);
    expect(getReferenceVaultEmptyStateActions({ onOpenChannelWatchlist: () => 'channel watchlist' })).toHaveLength(1);
  });

  it('passes reference vault empty-state actions through video results panel props', () => {
    const onOpenChannelWatchlist = () => 'open channel watchlist';
    const onOpenHome = () => 'open home';

    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: [],
      filteredVideos: [],
      onOpenChannelWatchlist,
      onOpenHome,
      showWorkPanel: false,
      videos: [],
    });

    expect(props.referenceVaultEmptyStateProps.actions.map(action => action.key)).toEqual([
      'channel-watchlist',
      'home',
    ]);
  });

  it('passes selected channel and stored lookup state to the reference vault empty state', () => {
    const onLoadStoredVideos = () => 'load';
    const onOpenSelectedScan = () => 'scan';
    const storedVideoLoadResult = { success: true, videoCount: 0 };
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      onLoadStoredVideos,
      onOpenSelectedScan,
      selectedChannelCount: 3,
      storedVideoLoadPending: true,
      storedVideoLoadResult,
      videos: [],
    });

    expect(props.referenceVaultEmptyStateProps).toMatchObject({
      loading: true,
      loadResult: storedVideoLoadResult,
      onLoadStoredVideos,
      onOpenSelectedScan,
      selectedChannelCount: 3,
    });
  });

  it('builds a filter empty-state reset action without scan, save, or API side effects', () => {
    const onResetFilters = () => 'reset filters';

    const actions = getVideoFilterEmptyStateActions({ onResetFilters });

    expect(actions).toEqual([
      expect.objectContaining({
        key: 'reset-filters',
        iconKey: 'reset-filters',
        label: '필터 초기화',
        onClick: onResetFilters,
      }),
    ]);
    expect(actions[0].title).toContain('저장, 수집, YouTube API 호출은 실행하지 않습니다');
  });

  it('omits filter empty-state actions when reset handler is unavailable', () => {
    expect(getVideoFilterEmptyStateActions()).toEqual([]);
    expect(getVideoFilterEmptyStateActions({ onResetFilters: 'bad' })).toEqual([]);
  });

  it('passes filter empty-state actions through video results panel props', () => {
    const onResetFilters = () => 'reset filters';

    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: [],
      filteredVideos: [],
      onResetFilters,
      showWorkPanel: false,
      videos: [video],
    });

    expect(props.videoFilterEmptyStateProps.actions).toEqual([
      expect.objectContaining({
        key: 'reset-filters',
        onClick: onResetFilters,
      }),
    ]);
  });
});
