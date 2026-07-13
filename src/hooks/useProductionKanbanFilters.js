import { useMemo, useState } from 'react';

import {
  PRODUCTION_KANBAN_FILTER,
  getFilteredProductionKanbanData,
  getProductionKanbanFilterSummary,
} from '../utils/productionKanbanFilters';

export function useProductionKanbanFilters({
  dataModel,
  draftRecords,
  initialSearchQuery = '',
  videoUserRecords,
}) {
  const [filterMode, setFilterMode] = useState(PRODUCTION_KANBAN_FILTER.ALL);
  const [searchQuery, setSearchQuery] = useState(() => String(initialSearchQuery || '').trim());

  const filteredDataModel = useMemo(() => getFilteredProductionKanbanData({
    dataModel,
    draftRecords,
    filterMode,
    searchQuery,
    videoUserRecords,
  }), [dataModel, draftRecords, filterMode, searchQuery, videoUserRecords]);

  const filterSummary = useMemo(() => getProductionKanbanFilterSummary({
    dataModel,
    filteredDataModel,
    filterMode,
    searchQuery,
  }), [dataModel, filteredDataModel, filterMode, searchQuery]);

  const resetFilters = () => {
    setFilterMode(PRODUCTION_KANBAN_FILTER.ALL);
    setSearchQuery('');
  };

  return {
    filterMode,
    filterSummary,
    filteredDataModel,
    resetFilters,
    searchQuery,
    setFilterMode,
    setSearchQuery,
  };
}
