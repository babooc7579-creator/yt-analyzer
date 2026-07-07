import { describe, expect, it } from 'vitest';

import { getVideoToolbarViewProps } from './videoToolbarProps';

describe('videoToolbarProps utils', () => {
  const baseProps = {
    activeSelectedChannelCount: 2,
    filteredCount: 10,
    filteredVideoUrlList: '1. First\nhttps://youtube.com/watch?v=1',
    handleManualScan: () => 'scan',
    isScanning: false,
    lengthFilter: 'shorts',
    scannableChannelCount: 5,
    searchKeyword: 'idea',
    selectedChannelCount: 3,
    setLengthFilter: () => 'length',
    setSearchKeyword: () => 'search',
    setShowWorkPanel: () => 'panel',
    setSortType: () => 'sort',
    setTtoTtoMode: () => 'tteotteotto',
    setViewFilter: () => 'view filter',
    setViewMode: () => 'view mode',
    showWorkPanel: true,
    sortType: 'views',
    totalCount: 100,
    ttoTtoMode: true,
    viewFilter: 10000,
    viewMode: 'grid',
  };

  it('builds filter, reference header, scan action, and tteotteotto button props', () => {
    const props = getVideoToolbarViewProps(baseProps);

    expect(props.filtersProps).toMatchObject({
      lengthFilter: 'shorts',
      searchKeyword: 'idea',
      showWorkPanel: true,
      sortType: 'views',
      viewFilter: 10000,
      viewMode: 'grid',
    });
    expect(props.referenceHeaderProps).toEqual({
      filteredCount: 10,
      filteredVideoUrlList: '1. First\nhttps://youtube.com/watch?v=1',
      totalCount: 100,
    });
    expect(props.scanActionProps).toEqual({
      handleManualScan: baseProps.handleManualScan,
      isScanning: false,
      scanTargetCount: 2,
      selectedChannelCount: 3,
    });
    expect(props.ttoTtoButtonProps).toEqual({
      setTtoTtoMode: baseProps.setTtoTtoMode,
      ttoTtoMode: true,
    });
  });

  it('uses selected active channel count when channels are selected', () => {
    expect(getVideoToolbarViewProps({
      ...baseProps,
      activeSelectedChannelCount: 4,
      scannableChannelCount: 9,
      selectedChannelCount: 6,
    }).scanActionProps.scanTargetCount).toBe(4);
  });

  it('uses all scannable channel count when no channel is selected', () => {
    expect(getVideoToolbarViewProps({
      ...baseProps,
      activeSelectedChannelCount: 0,
      scannableChannelCount: 9,
      selectedChannelCount: 0,
    }).scanActionProps.scanTargetCount).toBe(9);
  });
});
