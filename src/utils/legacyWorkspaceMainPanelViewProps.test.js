import { describe, expect, it } from 'vitest';

import { getLegacyWorkspaceMainPanelViewProps } from './legacyWorkspaceMainPanelViewProps';

describe('legacyWorkspaceMainPanelViewProps utils', () => {
  it('builds dashboard tab props with safe video and channel lists', () => {
    const savedChannels = [{ id: 'channel1' }];
    const savedVideos = [{ videoId: 'saved1' }, null, 'bad'];
    const videos = [{ videoId: 'video1' }, null, 'bad'];

    const props = getLegacyWorkspaceMainPanelViewProps({
      activeSelectedChannelCount: 1,
      activeTab: 'dashboard',
      checkedVideos: ['video1'],
      filteredAndSortedVideos: [{ videoId: 'video1' }, undefined],
      lengthFilter: 'shorts',
      savedChannels,
      savedVideos,
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelIds: ['channel1'],
      sortType: 'views',
      totalVideoCount: 3,
      ttoTtoAssetCount: 4,
      ttoTtoMode: 'classic',
      videos,
      viewFilter: 'all',
      viewMode: 'grid',
      visibleScrapCount: 5,
    });

    expect(props.dashboardTabProps).toMatchObject({
      activeSelectedChannelCount: 1,
      checkedVideos: ['video1'],
      filteredAndSortedVideos: [{ videoId: 'video1' }],
      lengthFilter: 'shorts',
      savedChannels,
      savedVideos: [{ videoId: 'saved1' }],
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelIds: ['channel1'],
      sortType: 'views',
      totalVideoCount: 3,
      ttoTtoAssetCount: 4,
      ttoTtoMode: 'classic',
      videos: [{ videoId: 'video1' }],
      viewFilter: 'all',
      viewMode: 'grid',
      visibleScrapCount: 5,
    });
  });

  it('builds workspace tab props from active tab and saved video count', () => {
    const setActiveTab = () => 'tab';

    const props = getLegacyWorkspaceMainPanelViewProps({
      activeTab: 'vault',
      savedVideos: [{ videoId: 'saved1' }, { videoId: 'saved2' }],
      setActiveTab,
    });

    expect(props.workspaceTabsProps).toEqual({
      activeTab: 'vault',
      onSelectTab: setActiveTab,
      savedVideoCount: 2,
    });
  });

  it('forwards dashboard handlers and setters', () => {
    const copyPromptForVideos = () => 'copy';
    const fetchTopComments = () => 'comments';
    const handleManualScan = () => 'scan';
    const isProductionCandidate = () => true;
    const isVideoSaved = () => true;
    const openCreatorView = () => 'open';
    const promoteVideoToProduction = () => 'promote';
    const setLengthFilter = () => 'length';
    const setSearchKeyword = () => 'search';
    const setShowWorkPanel = () => 'work';
    const setSortType = () => 'sort';
    const setTtoTtoMode = () => 'mode';
    const setViewFilter = () => 'filter';
    const setViewMode = () => 'view';
    const toggleCheckVideo = () => 'check';
    const toggleScrapVideo = () => 'scrap';

    const props = getLegacyWorkspaceMainPanelViewProps({
      copyPromptForVideos,
      fetchTopComments,
      handleManualScan,
      isProductionCandidate,
      isVideoSaved,
      openCreatorView,
      promoteVideoToProduction,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      toggleCheckVideo,
      toggleScrapVideo,
    });

    expect(props.dashboardTabProps.copyPromptForVideos).toBe(copyPromptForVideos);
    expect(props.dashboardTabProps.fetchTopComments).toBe(fetchTopComments);
    expect(props.dashboardTabProps.handleManualScan).toBe(handleManualScan);
    expect(props.dashboardTabProps.isProductionCandidate).toBe(isProductionCandidate);
    expect(props.dashboardTabProps.isVideoSaved).toBe(isVideoSaved);
    expect(props.dashboardTabProps.openCreatorView).toBe(openCreatorView);
    expect(props.dashboardTabProps.promoteVideoToProduction).toBe(promoteVideoToProduction);
    expect(props.dashboardTabProps.setLengthFilter).toBe(setLengthFilter);
    expect(props.dashboardTabProps.setSearchKeyword).toBe(setSearchKeyword);
    expect(props.dashboardTabProps.setShowWorkPanel).toBe(setShowWorkPanel);
    expect(props.dashboardTabProps.setSortType).toBe(setSortType);
    expect(props.dashboardTabProps.setTtoTtoMode).toBe(setTtoTtoMode);
    expect(props.dashboardTabProps.setViewFilter).toBe(setViewFilter);
    expect(props.dashboardTabProps.setViewMode).toBe(setViewMode);
    expect(props.dashboardTabProps.toggleCheckVideo).toBe(toggleCheckVideo);
    expect(props.dashboardTabProps.toggleScrapVideo).toBe(toggleScrapVideo);
  });

  it('builds vault tab props with saved videos, records, and handlers', () => {
    const copyPromptForVideos = () => 'copy';
    const discoveryLinks = [{ id: 'link1' }];
    const fetchTopComments = () => 'comments';
    const markRadarVideoStatus = () => 'mark';
    const openCreatorView = () => 'open';
    const savedVideos = [{ videoId: 'saved1' }, null];
    const toggleScrapVideo = () => 'scrap';
    const updateDiscoveryLink = () => 'link';
    const updateVideoUserRecord = () => 'record';
    const videoUserRecords = { saved1: { status: 'candidate' } };

    const props = getLegacyWorkspaceMainPanelViewProps({
      creatorView: 'vault-all',
      copiedPrompt: 'prompt',
      copyPromptForVideos,
      discoveryLinks,
      fetchTopComments,
      markRadarVideoStatus,
      openCreatorView,
      promptCopyError: 'copy failed',
      savedVideos,
      toggleScrapVideo,
      updateDiscoveryLink,
      updateVideoUserRecord,
      videoUserRecords,
    });

    expect(props.vaultTabProps).toMatchObject({
      creatorView: 'vault-all',
      copiedPrompt: 'prompt',
      discoveryLinks,
      promptCopyError: 'copy failed',
      savedVideos: [{ videoId: 'saved1' }],
      videoUserRecords,
    });
    expect(props.vaultTabProps.copyPromptForVideos).toBe(copyPromptForVideos);
    expect(props.vaultTabProps.fetchTopComments).toBe(fetchTopComments);
    expect(props.vaultTabProps.markRadarVideoStatus).toBe(markRadarVideoStatus);
    expect(props.vaultTabProps.openCreatorView).toBe(openCreatorView);
    expect(props.vaultTabProps.toggleScrapVideo).toBe(toggleScrapVideo);
    expect(props.vaultTabProps.updateDiscoveryLink).toBe(updateDiscoveryLink);
    expect(props.vaultTabProps.updateVideoUserRecord).toBe(updateVideoUserRecord);
  });
});
