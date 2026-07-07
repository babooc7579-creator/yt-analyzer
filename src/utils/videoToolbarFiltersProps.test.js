import { describe, expect, it } from 'vitest';

import { getVideoToolbarFiltersViewProps } from './videoToolbarFiltersProps';

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
});
