import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import { PRODUCTION_KANBAN_FILTER } from '../utils/productionKanbanFilters';

const { stateSetters, stateValueOverrides } = vi.hoisted(() => ({
  stateSetters: [],
  stateValueOverrides: [],
}));

vi.mock('react', () => ({
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    const fallbackValue = typeof initialValue === 'function' ? initialValue() : initialValue;
    const value = stateValueOverrides.length ? stateValueOverrides.shift() : fallbackValue;

    stateSetters.push(setter);
    return [value, setter];
  }),
}));

import { useProductionKanbanFilters } from './useProductionKanbanFilters';

const dataModel = {
  discoveryLinkCandidates: [{ id: 'link-1', title: '예약 영상' }],
  focusVideos: [],
  groupedVideos: {
    [PRODUCTION_STATUS.CANDIDATE]: [
      { videoId: 'video-1', title: '예약 영상' },
      { videoId: 'video-2', title: '예약 영상' },
    ],
    [PRODUCTION_STATUS.ACTIVE]: [],
    [PRODUCTION_STATUS.DONE]: [],
  },
  productionSummary: { videoCount: 2 },
};

describe('useProductionKanbanFilters', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    stateValueOverrides.length = 0;
    vi.clearAllMocks();
  });

  it('keeps a calendar lookup scoped to the selected video until the user edits it', () => {
    const result = useProductionKanbanFilters({
      dataModel,
      initialSearchQuery: '예약 영상',
      initialSearchSource: 'upload-calendar',
      initialTargetVideoId: 'video-2',
      videoUserRecords: {},
    });

    expect(result.filteredDataModel.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([
      { videoId: 'video-2', title: '예약 영상' },
    ]);
    expect(result.filteredDataModel.discoveryLinkCandidates).toEqual([]);
    expect(result.searchContext?.description).toContain('영상 한 건을');

    result.setSearchQuery('새 검색');

    expect(stateSetters[2]).toHaveBeenCalledWith('');
    expect(stateSetters[1]).toHaveBeenCalledWith('새 검색');
  });

  it('clears stage, text, and calendar target together', () => {
    stateValueOverrides.push(PRODUCTION_KANBAN_FILTER.ACTIVE, '예약 영상', 'video-2');

    const result = useProductionKanbanFilters({
      dataModel,
      initialSearchSource: 'upload-calendar',
      videoUserRecords: {},
    });

    result.resetFilters();

    expect(stateSetters[0]).toHaveBeenCalledWith(PRODUCTION_KANBAN_FILTER.ALL);
    expect(stateSetters[1]).toHaveBeenCalledWith('');
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });
});
