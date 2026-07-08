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
      searchKeyword: 'cake',
      setLengthFilter: () => 'length',
      setSearchKeyword: () => 'search',
      setShowWorkPanel: () => 'panel',
      setSortType: () => 'sort',
      setViewFilter: () => 'view filter',
      setViewMode: () => 'view mode',
      showWorkPanel: true,
      sortType: 'views',
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
  });

  it('builds search field copy', () => {
    expect(getVideoToolbarSearchFieldViewProps()).toEqual({
      ariaLabel: '저장 영상 제목 검색',
      placeholder: '제목 검색...',
      title: '불러온 저장 영상 제목 검색',
    });
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
    expect(props.viewFilterTitle).toContain('저장 영상');
  });

  it('builds sort control options in display order', () => {
    expect(getVideoToolbarSortControlOptions().map((option) => option.value)).toEqual([
      'multiplier',
      'viral',
      'date',
      'likes',
    ]);
    expect(getVideoToolbarSortControlOptions()[0]).toMatchObject({
      ariaLabel: '대박 지수 높은 순 정렬',
      label: '대박지수',
    });
  });

  it('builds view mode options in display order', () => {
    expect(getVideoToolbarViewModeOptions()).toEqual([
      {
        value: 'card',
        label: '카드 보기',
        title: '영상 후보를 카드 형태로 보기',
        ariaLabel: '카드 보기로 전환',
      },
      {
        value: 'list',
        label: '리스트 보기',
        title: '영상 후보를 표 형태로 보기',
        ariaLabel: '리스트 보기로 전환',
      },
    ]);
  });

  it('builds work panel toggle copy for open and closed states', () => {
    expect(getVideoToolbarWorkPanelToggleViewProps({
      showWorkPanel: true,
    })).toEqual({
      ariaLabel: '작업 패널 닫기',
      label: '작업 패널 닫기',
      title: '작업 패널 숨기기',
    });

    expect(getVideoToolbarWorkPanelToggleViewProps({
      showWorkPanel: false,
    })).toEqual({
      ariaLabel: '작업 패널 열기',
      label: '작업 패널 열기',
      title: '카드 보기에서 작업 패널 함께 보기',
    });
  });
});
