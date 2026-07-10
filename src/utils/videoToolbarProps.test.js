import { describe, expect, it } from 'vitest';

import {
  getVideoToolbarReferenceHeaderViewProps,
  getVideoToolbarScanActionViewProps,
  getVideoToolbarTtoTtoButtonViewProps,
  getVideoToolbarViewProps,
} from './videoToolbarProps';

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

  it('builds selected-channel scan copy as a YouTube API action', () => {
    const props = getVideoToolbarScanActionViewProps({
      isScanning: false,
      scanTargetCount: 2,
      selectedChannelCount: 3,
    });

    expect(props).toMatchObject({
      hasScanTargets: true,
      isScanDisabled: false,
      scanAriaLabel: '선택 범위 새 영상 수집, YouTube API 호출',
      scanButtonLabel: '선택 채널 새 영상 수집 (2/3개)',
    });
    expect(props.scanTitle).toContain('YouTube API');
    expect(props.scanDescription).toContain('체크한 채널');
  });

  it('builds all-active-channel scan copy when no channel is selected', () => {
    const props = getVideoToolbarScanActionViewProps({
      isScanning: false,
      scanTargetCount: 5,
      selectedChannelCount: 0,
    });

    expect(props.scanButtonLabel).toBe('전체 운영중 채널 새 영상 수집 (5개)');
    expect(props.scanDescription).toContain('전체 운영중 채널');
    expect(props.isScanDisabled).toBe(false);
  });

  it('disables scan action when there are no scan targets or scan is running', () => {
    expect(getVideoToolbarScanActionViewProps({
      isScanning: false,
      scanTargetCount: 0,
      selectedChannelCount: 0,
    })).toMatchObject({
      hasScanTargets: false,
      isScanDisabled: true,
      scanAriaLabel: '새 영상 수집 불가, 운영중 채널 없음',
    });

    expect(getVideoToolbarScanActionViewProps({
      isScanning: true,
      scanTargetCount: 2,
      selectedChannelCount: 2,
    })).toMatchObject({
      hasScanTargets: true,
      isScanDisabled: true,
      scanButtonLabel: '새 영상 수집 중...',
    });
  });

  it('builds reference header copy and disables URL copy when list is empty', () => {
    const props = getVideoToolbarReferenceHeaderViewProps({
      filteredCount: 3,
      filteredVideoUrlList: '',
      totalCount: 12,
    });

    expect(props).toMatchObject({
      copyButtonAriaLabel: '현재 표시된 저장 영상 3개 URL 목록 복사',
      copyButtonCopiedLabel: '목록 복사 완료',
      copyButtonDisabled: true,
      copyButtonLabel: '영상 URL 목록 복사',
      statusText: '현재 표시 3개 / 전체 12개',
      title: '보관함 도구막대',
    });
    expect(props.copyButtonTitle).toContain('YouTube API 호출이나 저장 작업은 없습니다');
  });

  it('enables reference header URL copy when list exists', () => {
    expect(getVideoToolbarReferenceHeaderViewProps({
      filteredCount: 1,
      filteredVideoUrlList: 'https://youtube.com/watch?v=1',
      totalCount: 1,
    }).copyButtonDisabled).toBe(false);
  });

  it('disables reference header URL copy when list is whitespace-only', () => {
    expect(getVideoToolbarReferenceHeaderViewProps({
      filteredCount: 1,
      filteredVideoUrlList: '   ',
      totalCount: 1,
    }).copyButtonDisabled).toBe(true);
  });

  it('builds tteotteotto button copy for both modes', () => {
    expect(getVideoToolbarTtoTtoButtonViewProps({
      ttoTtoMode: true,
    })).toMatchObject({
      ariaLabel: '터또터 발굴 모드 끄기, 화면 필터만 변경하며 YouTube API 호출 없음',
      label: '터또터 발굴 (6개월+)',
    });
    expect(getVideoToolbarTtoTtoButtonViewProps({
      ttoTtoMode: true,
    }).title).toContain('화면 표시 조건만 바꾸며 YouTube API를 새로 호출하지 않습니다');

    const inactiveProps = getVideoToolbarTtoTtoButtonViewProps({
      ttoTtoMode: false,
    });

    expect(inactiveProps).toMatchObject({
      ariaLabel: '터또터 발굴 모드 켜기, 현재 불러온 저장 영상 필터링, YouTube API 호출 없음',
    });
    expect(inactiveProps.title).toContain('현재 불러온 저장 영상');
    expect(inactiveProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
  });
});
