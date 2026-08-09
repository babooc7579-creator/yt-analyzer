import { describe, expect, it } from 'vitest';

import { getLegacyDashboardTabViewProps } from './legacyDashboardTabViewProps';

describe('legacyDashboardTabViewProps utils', () => {
  it('builds dashboard controls with safe lists and counts', () => {
    const filteredVideos = [{ videoId: 'video1' }, null, 'bad'];
    const savedChannels = [{ id: 'channel1', title: 'TechByTosh' }, undefined];
    const savedVideos = [{ videoId: 'saved1' }, false];

    const props = getLegacyDashboardTabViewProps({
      activeSelectedChannelCount: 1,
      checkedVideos: ['video1'],
      copiedPrompt: 'copied',
      filteredAndSortedVideos: filteredVideos,
      isReferenceVaultView: true,
      isScanning: false,
      lengthFilter: 'shorts',
      promptCopyError: 'copy failed',
      savedChannels,
      savedVideos,
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelIds: ['channel1', 'channel2'],
      showWorkPanel: true,
      sortType: 'views',
      totalVideoCount: 3,
      ttoTtoAssetCount: 4,
      ttoTtoMode: 'classic',
      viewFilter: 'saved',
      viewMode: 'grid',
      visibleScrapCount: 5,
    });

    expect(props.controlsProps).toMatchObject({
      activeSelectedChannelCount: 1,
      checkedVideos: ['video1'],
      copiedPrompt: 'copied',
      filteredCount: 1,
      filteredVideos: [{ videoId: 'video1' }],
      isReferenceVaultView: true,
      isScanning: false,
      lengthFilter: 'shorts',
      promptCopyError: 'copy failed',
      quickFilterCounts: { recent30: null, oldPopular: null, ttoTto: null },
      savedChannelCount: 2,
      savedVideoCount: 1,
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelCount: 2,
      selectedChannelTitles: ['TechByTosh'],
      showWorkPanel: true,
      sortType: 'views',
      totalVideoCount: 3,
      ttoTtoAssetCount: 4,
      ttoTtoMode: 'classic',
      viewFilter: 'saved',
      viewMode: 'grid',
      visibleScrapCount: 5,
    });
    expect(props.commentApiNotice).toContain('YouTube API');
    expect(props.commentApiNotice).toContain('수집 영상 목록 불러오기');
  });

  it('copies only checked videos from the full video list', () => {
    let copiedVideos = [];
    const copyPromptForVideos = (videos) => {
      copiedVideos = videos;
      return 'copy result';
    };
    const selectedVideo = { videoId: 'video1', title: 'Selected video' };

    const props = getLegacyDashboardTabViewProps({
      checkedVideos: ['video1', 'missing'],
      copyPromptForVideos,
      videos: [selectedVideo, { videoId: 'video2' }, null],
    });

    expect(props.controlsProps.onCopyPrompt()).toBe('copy result');
    expect(copiedVideos).toEqual([selectedVideo]);
  });

  it('summarizes selected channel video counts only after a successful Azure DB lookup', () => {
    const baseProps = {
      savedChannels: [
        { id: 'channel1', title: 'TechByTosh' },
        { id: 'channel2', title: 'David Fortin' },
      ],
      selectedChannelIds: ['channel1', 'channel2'],
      videos: [
        { videoId: 'v1', channel_id: 'channel1', channel_title: 'TechByTosh' },
        { videoId: 'v2', channel_id: 'channel1', channel_title: 'TechByTosh' },
        { videoId: 'v3', channel_id: 'channel2', channel_title: 'David Fortin' },
      ],
    };

    expect(getLegacyDashboardTabViewProps(baseProps).controlsProps.selectedChannelScopes).toEqual([
      { id: 'channel1', title: 'TechByTosh', videoCount: null },
      { id: 'channel2', title: 'David Fortin', videoCount: null },
    ]);
    expect(getLegacyDashboardTabViewProps({
      ...baseProps,
      storedVideoLoadResult: { success: true, videoCount: 3 },
    }).controlsProps.selectedChannelScopes).toEqual([
      { id: 'channel1', title: 'TechByTosh', videoCount: 2 },
      { id: 'channel2', title: 'David Fortin', videoCount: 1 },
    ]);
    expect(getLegacyDashboardTabViewProps({
      ...baseProps,
      storedVideoLoadResult: { success: true, videoCount: 3 },
    }).controlsProps.quickFilterCounts).toEqual({ recent30: 0, oldPopular: 0, ttoTto: 0 });
    expect(getLegacyDashboardTabViewProps({
      savedChannels: [{ id: 'channel1', title: 'Zero Channel' }],
      selectedChannelIds: ['channel1'],
      videos: [],
      storedVideoLoadResult: { success: true, videoCount: 0 },
    }).controlsProps.selectedChannelScopes).toEqual([
      { id: 'channel1', title: 'Zero Channel', videoCount: 0 },
    ]);
  });

  it('forwards result actions, setters, and display options', () => {
    const clearCheckedVideos = () => 'clear';
    const fetchTopComments = () => 'comments';
    const handleManualScan = () => 'scan';
    const isProductionCandidate = () => true;
    const isVideoSaved = () => true;
    const openedViews = [];
    const openCreatorView = (item) => openedViews.push(item);
    const loadStoredVideosForSelectedChannels = () => 'load stored';
    const promoteVideoToProduction = () => 'promote';
    const filterResets = [];
    const setLengthFilter = (value) => filterResets.push(['length', value]);
    const setQuickFilter = (value) => filterResets.push(['quick', value]);
    const setSearchKeyword = (value) => filterResets.push(['search', value]);
    const setShowWorkPanel = () => 'work';
    const setSortType = () => 'sort';
    const setTtoTtoMode = (value) => filterResets.push(['tteotteotto', value]);
    const setViewFilter = (value) => filterResets.push(['view', value]);
    const setViewMode = () => 'view';
    const toggleCheckVideo = () => 'check';
    const toggleScrapVideo = () => 'scrap';
    const videos = [{ videoId: 'video1' }, null];

    const props = getLegacyDashboardTabViewProps({
      checkedVideos: ['video1'],
      clearCheckedVideos,
      fetchTopComments,
      filteredAndSortedVideos: videos,
      handleManualScan,
      isProductionCandidate,
      isVideoSaved,
      loadStoredVideosForSelectedChannels,
      openCreatorView,
      promoteVideoToProduction,
      setLengthFilter,
      setQuickFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      showWorkPanel: false,
      selectedChannelIds: ['channel-1', 'channel-2'],
      storedVideoLoadPending: true,
      storedVideoLoadResult: { success: true, videoCount: 0 },
      toggleCheckVideo,
      toggleScrapVideo,
      videos,
      viewMode: 'list',
    });

    expect(props.controlsProps.onManualScan).toBe(handleManualScan);
    props.controlsProps.onChangeSelectedChannels();
    expect(props.controlsProps.onClearSelection).toBe(clearCheckedVideos);
    expect(props.controlsProps.setLengthFilter).toBe(setLengthFilter);
    expect(props.controlsProps.setSearchKeyword).toBe(setSearchKeyword);
    expect(props.controlsProps.setShowWorkPanel).toBe(setShowWorkPanel);
    expect(props.controlsProps.setSortType).toBe(setSortType);
    expect(props.controlsProps.setTtoTtoMode).toBe(setTtoTtoMode);
    expect(props.controlsProps.setViewFilter).toBe(setViewFilter);
    expect(props.controlsProps.setViewMode).toBe(setViewMode);

    expect(props.resultsPanelProps).toMatchObject({
      checkedVideos: ['video1'],
      filteredVideos: [{ videoId: 'video1' }],
      showWorkPanel: false,
      videos: [{ videoId: 'video1' }],
      viewMode: 'list',
    });
    expect(props.resultsPanelProps.isProductionCandidate).toBe(isProductionCandidate);
    expect(props.resultsPanelProps.isVideoSaved).toBe(isVideoSaved);
    expect(props.resultsPanelProps.onFetchComments).toBe(fetchTopComments);
    props.resultsPanelProps.onOpenHome();
    props.resultsPanelProps.onOpenChannelWatchlist();
    props.resultsPanelProps.onOpenSelectedScan();
    expect(openedViews).toEqual([
      { id: 'discovery-watchlist' },
      { id: 'home' },
      { id: 'discovery-watchlist' },
      { id: 'ops-channels', intent: { operationStage: 'scan' } },
    ]);
    expect(props.resultsPanelProps.onLoadStoredVideos).toBe(loadStoredVideosForSelectedChannels);
    expect(props.resultsPanelProps.selectedChannelCount).toBe(2);
    expect(props.resultsPanelProps.storedVideoLoadPending).toBe(true);
    expect(props.resultsPanelProps.storedVideoLoadResult).toEqual({ success: true, videoCount: 0 });
    expect(props.resultsPanelProps.onPromoteToProduction).toBe(promoteVideoToProduction);
    props.resultsPanelProps.onResetFilters();
    expect(filterResets).toEqual([
      ['search', ''],
      ['view', 0],
      ['length', 'all'],
      ['quick', 'all'],
      ['tteotteotto', false],
    ]);
    expect(props.resultsPanelProps.onToggleCheck).toBe(toggleCheckVideo);
    expect(props.resultsPanelProps.onToggleScrap).toBe(toggleScrapVideo);
  });

  it('leaves reference vault empty-state navigation unavailable without Creator view opener', () => {
    const props = getLegacyDashboardTabViewProps({});

    expect(props.resultsPanelProps.onOpenHome).toBeUndefined();
    expect(props.resultsPanelProps.onOpenChannelWatchlist).toBeUndefined();
    expect(props.resultsPanelProps.onResetFilters).toBeUndefined();
  });
});
