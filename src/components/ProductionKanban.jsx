import { useEffect } from 'react';

import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import { useProductionKanbanFilters } from '../hooks/useProductionKanbanFilters';
import {
  getProductionKanbanContentProps,
  shouldShowProductionKanbanEmptyState,
} from '../utils/productionKanbanProps';
import {
  getGuardedProductionNavigationHandlers,
  registerProductionBeforeUnloadGuard,
} from '../utils/productionNavigation';
import ProductionKanbanContent from './ProductionKanbanContent';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';
import ProductionKanbanFilteredEmptyState from './ProductionKanbanFilteredEmptyState';
import ProductionKanbanFilters from './ProductionKanbanFilters';

export default function ProductionKanban({
  discoveryLinks = [],
  initialSearchQuery = '',
  initialSearchSource = '',
  initialTargetDiscoveryLinkId = '',
  initialTargetVideoId = '',
  videos,
  videoUserRecords,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenHome,
  onOpenUploadCalendar,
  onConfirmUnsavedNavigation,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
  onOpenReferenceVault,
}) {
  const {
    draftRecords,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
  } = useProductionKanbanActions({
    onMoveVideo,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    videoUserRecords,
  });

  const dataModel = useProductionKanbanData({
    discoveryLinks,
    draftRecords,
    videoUserRecords,
    videos,
  });
  const {
    discoveryLinkCandidates,
    productionSummary,
  } = dataModel;

  const {
    filterMode,
    filterSummary,
    filteredDataModel,
    resetFilters,
    searchQuery,
    searchContext,
    setFilterMode,
    setSearchQuery,
  } = useProductionKanbanFilters({
    dataModel,
    draftRecords,
    initialSearchQuery,
    initialSearchSource,
    initialTargetDiscoveryLinkId,
    initialTargetVideoId,
    videoUserRecords,
  });
  const hasUnsavedDrafts = filterSummary.unsavedCount > 0;

  useEffect(() => registerProductionBeforeUnloadGuard({
    hasUnsavedDrafts,
    target: typeof window === 'undefined' ? undefined : window,
  }), [hasUnsavedDrafts]);

  if (shouldShowProductionKanbanEmptyState({ discoveryLinkCandidates, productionSummary })) {
    return (
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenHome={onOpenHome}
        onOpenReferenceVault={onOpenReferenceVault}
      />
    );
  }

  const confirmNavigation = (message) => {
    if (typeof onConfirmUnsavedNavigation === 'function') {
      return onConfirmUnsavedNavigation(message);
    }
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      return window.confirm(message);
    }
    return false;
  };
  const guardedNavigationHandlers = getGuardedProductionNavigationHandlers({
    confirmNavigation,
    handlers: {
      'discovery-links': onOpenDiscoveryLinks,
      home: onOpenHome,
      'reference-vault': onOpenReferenceVault,
      'upload-calendar': onOpenUploadCalendar,
    },
    hasUnsavedDrafts,
  });
  const filteredContentProps = getProductionKanbanContentProps({
    activeFilterMode: filterMode,
    discoveryLinkCandidates: filteredDataModel.discoveryLinkCandidates,
    draftRecords,
    focusVideos: filteredDataModel.focusVideos,
    groupedVideos: filteredDataModel.groupedVideos,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    onOpenDiscoveryLinks: guardedNavigationHandlers['discovery-links'],
    onOpenReferenceVault: guardedNavigationHandlers['reference-vault'],
    onOpenUploadCalendar: guardedNavigationHandlers['upload-calendar'],
    onFilterModeChange: setFilterMode,
    overallDiscoveryLinkCandidateCount: discoveryLinkCandidates.length,
    overallProductionSummary: productionSummary,
    productionSummary: filteredDataModel.productionSummary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
    videoUserRecords,
  });
  const onReturnToSearchSource = guardedNavigationHandlers[searchContext?.returnTarget];

  return (
    <div className="space-y-4">
      <ProductionKanbanFilters
        filterMode={filterMode}
        filterSummary={filterSummary}
        onFilterModeChange={setFilterMode}
        onReset={resetFilters}
        onReturnToSearchSource={onReturnToSearchSource}
        onSearchQueryChange={setSearchQuery}
        searchQuery={searchQuery}
        searchContext={searchContext}
      />
      {filterSummary.visibleCount === 0 ? (
        <ProductionKanbanFilteredEmptyState onReset={resetFilters} />
      ) : (
        <ProductionKanbanContent {...filteredContentProps} />
      )}
    </div>
  );
}
