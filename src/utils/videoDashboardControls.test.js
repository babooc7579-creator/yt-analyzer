import { describe, expect, it } from 'vitest';

import {
  getFilteredVideoUrlList,
  getVideoDashboardControlsViewProps,
} from './videoDashboardControls';

describe('videoDashboardControls utils', () => {
  const filteredVideos = [
    { videoId: 'video 1', title: 'First idea' },
    null,
    { videoId: '', title: 'Missing id' },
    { videoId: 'video-2', title: '' },
  ];

  it('formats filtered video URLs and skips invalid rows', () => {
    const urlList = getFilteredVideoUrlList(filteredVideos);

    expect(urlList).toContain('1. First idea');
    expect(urlList).toContain('https://youtube.com/watch?v=video%201');
    expect(urlList).toContain('2. ');
    expect(urlList).toContain('https://youtube.com/watch?v=video-2');
    expect(urlList).not.toContain('Missing id');
  });

  it('returns an empty URL list for invalid filtered video input', () => {
    expect(getFilteredVideoUrlList(null)).toBe('');
    expect(getFilteredVideoUrlList(['bad', undefined])).toBe('');
  });

  it('builds dashboard control props with selected video and source summary counts', () => {
    const onCopyPrompt = () => 'copy';
    const onManualScan = () => 'scan';

    const props = getVideoDashboardControlsViewProps({
      activeSelectedChannelCount: 2,
      checkedVideos: [{ videoId: 'video1' }, null, 'bad'],
      copiedPrompt: 'urls',
      promptCopyError: '',
      filteredCount: 3,
      filteredVideos,
      isReferenceVaultView: true,
      isScanning: false,
      lengthFilter: 'shorts',
      onCopyPrompt,
      onManualScan,
      savedChannelCount: 10,
      savedVideoCount: 200,
      scannableChannelCount: 4,
      searchKeyword: 'idea',
      selectedChannelCount: 5,
      setLengthFilter: () => 'length',
      setSearchKeyword: () => 'search',
      setShowWorkPanel: () => 'panel',
      setSortType: () => 'sort',
      setTtoTtoMode: () => 'tteotteotto',
      setViewFilter: () => 'view filter',
      setViewMode: () => 'view mode',
      showWorkPanel: true,
      sortType: 'views',
      totalVideoCount: 300,
      ttoTtoAssetCount: 7,
      ttoTtoMode: true,
      viewFilter: 10000,
      viewMode: 'grid',
      visibleScrapCount: 9,
    });

    expect(props.selectedVideosActionProps).toEqual({
      selectedCount: 1,
      copiedPrompt: 'urls',
      promptCopyError: '',
      onCopyPrompt,
    });
    expect(props.sourceSummaryProps).toEqual({
      isReferenceVaultView: true,
      savedChannelCount: 10,
      savedVideoCount: 200,
      totalVideoCount: 300,
      ttoTtoAssetCount: 7,
      visibleScrapCount: 9,
    });
    expect(props.toolbarProps).toMatchObject({
      activeSelectedChannelCount: 2,
      filteredCount: 3,
      handleManualScan: onManualScan,
      isReferenceVaultView: true,
      isScanning: false,
      lengthFilter: 'shorts',
      scannableChannelCount: 4,
      searchKeyword: 'idea',
      selectedChannelCount: 5,
      showWorkPanel: true,
      sortType: 'views',
      totalCount: 300,
      ttoTtoMode: true,
      viewFilter: 10000,
      viewMode: 'grid',
    });
    expect(props.toolbarProps.filteredVideoUrlList).toContain('First idea');
  });

  it('uses safe defaults for optional filtered video inputs', () => {
    const props = getVideoDashboardControlsViewProps({
      activeSelectedChannelCount: 0,
      checkedVideos: null,
      copiedPrompt: '',
      promptCopyError: 'copy failed',
      filteredCount: 0,
      isReferenceVaultView: false,
      isScanning: true,
      lengthFilter: 'all',
      onCopyPrompt: () => {},
      onManualScan: () => {},
      savedChannelCount: 0,
      savedVideoCount: 0,
      scannableChannelCount: 0,
      searchKeyword: '',
      selectedChannelCount: 0,
      setLengthFilter: () => {},
      setSearchKeyword: () => {},
      setShowWorkPanel: () => {},
      setSortType: () => {},
      setTtoTtoMode: () => {},
      setViewFilter: () => {},
      setViewMode: () => {},
      showWorkPanel: false,
      sortType: 'date',
      totalVideoCount: 0,
      ttoTtoAssetCount: 0,
      ttoTtoMode: false,
      viewFilter: 0,
      viewMode: 'list',
    });

    expect(props.selectedVideosActionProps.selectedCount).toBe(0);
    expect(props.toolbarProps.filteredVideoUrlList).toBe('');
  });
});
