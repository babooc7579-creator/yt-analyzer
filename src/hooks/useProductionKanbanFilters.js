import { useMemo, useState } from 'react';

import {
  PRODUCTION_KANBAN_FILTER,
  getFilteredProductionKanbanData,
  getProductionKanbanFilterSummary,
  getProductionKanbanSearchContext,
} from '../utils/productionKanbanFilters';

export function useProductionKanbanFilters({
  dataModel,
  draftRecords,
  initialSearchQuery = '',
  initialSearchSource = '',
  initialTargetVideoId = '',
  videoUserRecords,
}) {
  const [filterMode, setFilterMode] = useState(PRODUCTION_KANBAN_FILTER.ALL);
  const [searchQuery, setSearchQuery] = useState(() => String(initialSearchQuery || '').trim());
  const [targetVideoId, setTargetVideoId] = useState(() => String(initialTargetVideoId || '').trim());

  const filteredDataModel = useMemo(() => getFilteredProductionKanbanData({
    dataModel,
    draftRecords,
    filterMode,
    searchQuery,
    targetVideoId,
    videoUserRecords,
  }), [dataModel, draftRecords, filterMode, searchQuery, targetVideoId, videoUserRecords]);

  const filterSummary = useMemo(() => getProductionKanbanFilterSummary({
    dataModel,
    filteredDataModel,
    filterMode,
    searchQuery,
  }), [dataModel, filteredDataModel, filterMode, searchQuery]);

  const searchContext = useMemo(() => getProductionKanbanSearchContext({
    searchQuery,
    source: initialSearchSource,
    targetVideoId,
  }), [initialSearchSource, searchQuery, targetVideoId]);

  const updateSearchQuery = (value) => {
    setTargetVideoId('');
    setSearchQuery(value);
  };

  const resetFilters = () => {
    setFilterMode(PRODUCTION_KANBAN_FILTER.ALL);
    setSearchQuery('');
    setTargetVideoId('');
  };

  return {
    filterMode,
    filterSummary,
    filteredDataModel,
    resetFilters,
    searchQuery,
    searchContext,
    setFilterMode,
    setSearchQuery: updateSearchQuery,
  };
}
