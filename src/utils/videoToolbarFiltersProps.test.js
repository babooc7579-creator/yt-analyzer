import { describe, expect, it } from 'vitest';

import {
  getVideoToolbarFiltersViewProps,
  getVideoToolbarSearchFieldViewProps,
  getVideoToolbarSelectFiltersViewProps,
  getVideoToolbarSortControlOptions,
  getVideoToolbarViewModeOptions,
  getVideoToolbarWorkPanelToggleViewProps,
} from './videoToolbarFiltersProps';

describe('videoToolbarFiltersProps utils', () => {
  it('splits toolbar filter state and handlers into child prop groups', () => {
    const props = {
      lengthFilter: 'shorts',
      onResetFilters: () => 'reset',
      searchKeyword: 'cake',
      selectedVideoCount: 2,
      setLengthFilter: () => 'length',
      setSearchKeyword: () => 'search',
      setShowWorkPanel: () => 'panel',
      setSortType: () => 'sort',
      setViewFilter: () => 'view filter',
      setViewMode: () => 'view mode',
      showWorkPanel: true,
      sortType: 'views',
      ttoTtoMode: true,
      viewFilter: 10000,
      viewMode: 'grid',
    };

    expect(getVideoToolbarFiltersViewProps(props)).toEqual({
      searchFieldProps: {
        searchKeyword: 'cake',
        setSearchKeyword: props.setSearchKeyword,
      },
      selectFiltersProps: {
        lengthFilter: 'shorts',
        setLengthFilter: props.setLengthFilter,
        setViewFilter: props.setViewFilter,
        viewFilter: 10000,
      },
      sortControlProps: {
        setSortType: props.setSortType,
        sortType: 'views',
      },
      statusProps: {
        activeFilterCount: 4,
        activeFilterLabels: ['검색 ‘cake’', '조회수 10,000+', '쇼츠만', '또터또'],
        onResetFilters: props.onResetFilters,
        selectedVideoCount: 2,
      },
      viewModeControlProps: {
        setViewMode: props.setViewMode,
        viewMode: 'grid',
      },
      workPanelToggleProps: {
        setShowWorkPanel: props.setShowWorkPanel,
        showWorkPanel: true,
      },
    });
  });

  it('preserves falsy filter values for controlled inputs', () => {
    const props = getVideoToolbarFiltersViewProps({
      lengthFilter: '',
      searchKeyword: '',
      setLengthFilter: () => {},
      setSearchKeyword: () => {},
      setShowWorkPanel: () => {},
      setSortType: () => {},
      setViewFilter: () => {},
      setViewMode: () => {},
      showWorkPanel: false,
      sortType: '',
      viewFilter: 0,
      viewMode: '',
    });

    expect(props.searchFieldProps.searchKeyword).toBe('');
    expect(props.selectFiltersProps.viewFilter).toBe(0);
    expect(props.workPanelToggleProps.showWorkPanel).toBe(false);
    expect(props.statusProps).toMatchObject({
      activeFilterCount: 0,
      activeFilterLabels: [],
      selectedVideoCount: 0,
    });
  });

  it('builds search field copy', () => {
    expect(getVideoToolbarSearchFieldViewProps({ searchKeyword: 'cake' })).toEqual({
      ariaLabel: '수집 영상 제목 검색',
      clearAriaLabel: '수집 영상 검색어 지우기, 영상 선택 유지, API 호출 없음',
      clearTitle: '검색어만 지웁니다. 영상 선택은 유지하며 Azure DB나 YouTube API를 호출하지 않습니다.',
      placeholder: '제목 검색...',
      showClearButton: true,
      title: '불러온 수집 영상의 제목만 검색합니다. YouTube API를 새로 호출하지 않습니다.',
    });
    expect(getVideoToolbarSearchFieldViewProps({ searchKeyword: '' }).showClearButton).toBe(false);
  });

  it('builds select filter labels and option values', () => {
    const props = getVideoToolbarSelectFiltersViewProps();

    expect(props.viewFilterOptions).toEqual([
      { label: '조회수 전체', value: 0 },
      { label: '10만 이상', value: 100000 },
      { label: '50만 이상', value: 500000 },
      { label: '100만 이상', value: 1000000 },
    ]);
    expect(props.lengthFilterOptions).toEqual([
      { label: '길이 전체', value: 'all' },
      { label: '쇼츠만', value: 'shorts' },
      { label: '롱폼만', value: 'long' },
    ]);
    expect(props.viewFilterTitle).toContain('수집 영상');
    expect(props.viewFilterTitle).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props.lengthFilterTitle).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('builds sort control options in display order', () => {
    expect(getVideoToolbarSortControlOptions().map((option) => option.value)).toEqual([
      'recommended',
      'multiplier',
      'viral',
      'date',
      'likes',
    ]);
    expect(getVideoToolbarSortControlOptions()[0]).toMatchObject({
      ariaLabel: '추천순 정렬, 또터또 여부와 대박 지수 및 반응 기준, 화면 정렬만 변경, YouTube API 호출 없음',
      label: '추천순',
    });
    expect(getVideoToolbarSortControlOptions().every(option => (
      option.title.includes('YouTube API를 새로 호출하지 않습니다')
    ))).toBe(true);
  });

  it('builds view mode options in display order', () => {
    const options = getVideoToolbarViewModeOptions();

    expect(options.map(option => option.value)).toEqual(['card', 'list']);
    expect(options[0]).toMatchObject({
      label: '카드 보기',
      ariaLabel: '카드 보기로 전환, 화면 표시만 변경, YouTube API 호출 없음',
    });
    expect(options[1]).toMatchObject({
      label: '리스트 보기',
      ariaLabel: '리스트 보기로 전환, 화면 표시만 변경, YouTube API 호출 없음',
    });
    expect(options.every(option => option.title.includes('YouTube API를 새로 호출하지 않습니다'))).toBe(true);
  });

  it('builds work panel toggle copy for open and closed states', () => {
    expect(getVideoToolbarWorkPanelToggleViewProps({
      showWorkPanel: true,
    })).toEqual({
      ariaLabel: '작업 패널 닫기, 화면 표시만 변경, YouTube API 호출 없음',
      label: '작업 패널 닫기',
      title: '작업 패널을 숨깁니다. 화면 표시만 바꾸며 YouTube API를 새로 호출하지 않습니다.',
    });

    expect(getVideoToolbarWorkPanelToggleViewProps({
      showWorkPanel: false,
    })).toEqual({
      ariaLabel: '작업 패널 열기, 화면 표시만 변경, YouTube API 호출 없음',
      label: '작업 패널 열기',
      title: '카드 보기에서 작업 패널을 함께 봅니다. 화면 표시만 바꾸며 YouTube API를 새로 호출하지 않습니다.',
    });
  });
});
