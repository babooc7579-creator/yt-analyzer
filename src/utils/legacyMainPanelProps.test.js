import { describe, expect, it } from 'vitest';

import { getLegacyMainPanelProps } from './legacyMainPanelProps';

describe('legacyMainPanelProps utils', () => {
  it('preserves main panel view, filter, and video state props', () => {
    const filteredAndSortedVideos = [{ videoId: 'video1' }];
    const savedChannels = [{ id: 'channel1' }];
    const selectedChannelIds = ['channel1'];
    const videos = [{ videoId: 'video1' }, { videoId: 'video2' }];

    const props = getLegacyMainPanelProps({
      activeSelectedChannelCount: 1,
      activeTab: 'videos',
      creatorView: 'vault-all',
      filteredAndSortedVideos,
      isReferenceVaultView: true,
      lengthFilter: 'shorts',
      savedChannels,
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelIds,
      showWorkPanel: true,
      sortType: 'views',
      totalVideoCount: 2,
      ttoTtoAssetCount: 3,
      ttoTtoMode: 'classic',
      videos,
      viewFilter: 'candidate',
      viewMode: 'grid',
      visibleScrapCount: 4,
    });

    expect(props).toMatchObject({
      activeSelectedChannelCount: 1,
      activeTab: 'videos',
      creatorView: 'vault-all',
      filteredAndSortedVideos,
      isReferenceVaultView: true,
      lengthFilter: 'shorts',
      savedChannels,
      scannableChannelCount: 2,
      searchKeyword: 'table',
      selectedChannelIds,
      showWorkPanel: true,
      sortType: 'views',
      totalVideoCount: 2,
      ttoTtoAssetCount: 3,
      ttoTtoMode: 'classic',
      videos,
      viewFilter: 'candidate',
      viewMode: 'grid',
      visibleScrapCount: 4,
    });
  });

  it('forwards video action and production handlers without renaming them', () => {
    const copyPromptForVideos = () => 'copy';
    const fetchTopComments = () => 'comments';
    const handleManualScan = () => 'scan';
    const isProductionCandidate = () => true;
    const isVideoSaved = () => true;
    const markRadarVideoStatus = () => 'mark';
    const openCreatorView = () => 'open';
    const promoteVideoToProduction = () => 'promote';
    const toggleCheckVideo = () => 'check';
    const toggleScrapVideo = () => 'scrap';
    const updateVideoUserRecord = () => 'record';

    const props = getLegacyMainPanelProps({
      copyPromptForVideos,
      fetchTopComments,
      handleManualScan,
      isProductionCandidate,
      isVideoSaved,
      markRadarVideoStatus,
      openCreatorView,
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      updateVideoUserRecord,
    });

    expect(props.copyPromptForVideos).toBe(copyPromptForVideos);
    expect(props.fetchTopComments).toBe(fetchTopComments);
    expect(props.handleManualScan).toBe(handleManualScan);
    expect(props.isProductionCandidate).toBe(isProductionCandidate);
    expect(props.isVideoSaved).toBe(isVideoSaved);
    expect(props.markRadarVideoStatus).toBe(markRadarVideoStatus);
    expect(props.openCreatorView).toBe(openCreatorView);
    expect(props.promoteVideoToProduction).toBe(promoteVideoToProduction);
    expect(props.toggleCheckVideo).toBe(toggleCheckVideo);
    expect(props.toggleScrapVideo).toBe(toggleScrapVideo);
    expect(props.updateVideoUserRecord).toBe(updateVideoUserRecord);
  });

  it('forwards filter setters and discovery link props', () => {
    const discoveryLinks = [{ id: 'link1' }];
    const setActiveTab = () => 'tab';
    const setLengthFilter = () => 'length';
    const setSearchKeyword = () => 'search';
    const setShowWorkPanel = () => 'work';
    const setSortType = () => 'sort';
    const setTtoTtoMode = () => 'mode';
    const setViewFilter = () => 'filter';
    const setViewMode = () => 'view';
    const updateDiscoveryLink = () => 'link';

    const props = getLegacyMainPanelProps({
      discoveryLinks,
      setActiveTab,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      updateDiscoveryLink,
    });

    expect(props.discoveryLinks).toBe(discoveryLinks);
    expect(props.setActiveTab).toBe(setActiveTab);
    expect(props.setLengthFilter).toBe(setLengthFilter);
    expect(props.setSearchKeyword).toBe(setSearchKeyword);
    expect(props.setShowWorkPanel).toBe(setShowWorkPanel);
    expect(props.setSortType).toBe(setSortType);
    expect(props.setTtoTtoMode).toBe(setTtoTtoMode);
    expect(props.setViewFilter).toBe(setViewFilter);
    expect(props.setViewMode).toBe(setViewMode);
    expect(props.updateDiscoveryLink).toBe(updateDiscoveryLink);
  });
});
