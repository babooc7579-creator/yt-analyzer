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
  initialTargetDiscoveryLinkId = '',
  initialTargetVideoId = '',
  videoUserRecords,
}) {
  const [filterMode, setFilterMode] = useState(PRODUCTION_KANBAN_FILTER.ALL);
  const [searchQuery, setSearchQuery] = useState(() => String(initialSearchQuery || '').trim());
  const [targetDiscoveryLinkId, setTargetDiscoveryLinkId] = useState(() => String(initialTargetDiscoveryLinkId || '').trim());
  const [targetVideoId, setTargetVideoId] = useState(() => String(initialTargetVideoId || '').trim());

  const filteredDataModel = useMemo(() => getFilteredProductionKanbanData({
    dataModel,
    draftRecords,
    filterMode,
    searchQuery,
    targetDiscoveryLinkId,
    targetVideoId,
    videoUserRecords,
  }), [dataModel, draftRecords, filterMode, searchQuery, targetDiscoveryLinkId, targetVideoId, videoUserRecords]);

  const filterSummary = useMemo(() => getProductionKanbanFilterSummary({
    dataModel,
    filteredDataModel,
    filterMode,
    searchQuery,
    targetDiscoveryLinkId,
    targetVideoId,
  }), [dataModel, filteredDataModel, filterMode, searchQuery, targetDiscoveryLinkId, targetVideoId]);

  const searchContext = useMemo(() => getProductionKanbanSearchContext({
    searchQuery,
    source: initialSearchSource,
    targetDiscoveryLinkId,
    targetVideoId,
  }), [initialSearchSource, searchQuery, targetDiscoveryLinkId, targetVideoId]);

  const updateSearchQuery = (value) => {
    setTargetVideoId('');
    setTargetDiscoveryLinkId('');
    setSearchQuery(value);
  };

  const updateFilterMode = (value) => {
    setTargetVideoId('');
    setTargetDiscoveryLinkId('');
    setFilterMode(value);
  };

  const resetFilters = () => {
    setFilterMode(PRODUCTION_KANBAN_FILTER.ALL);
    setSearchQuery('');
    setTargetVideoId('');
    setTargetDiscoveryLinkId('');
  };

  return {
    filterMode,
    filterSummary,
    filteredDataModel,
    resetFilters,
    searchQuery,
    searchContext,
    setFilterMode: updateFilterMode,
    setSearchQuery: updateSearchQuery,
  };
}
