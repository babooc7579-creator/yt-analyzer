import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import { useProductionKanbanFilters } from '../hooks/useProductionKanbanFilters';
import {
  getProductionKanbanContentProps,
  shouldShowProductionKanbanEmptyState,
} from '../utils/productionKanbanProps';
import ProductionKanbanContent from './ProductionKanbanContent';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';
import ProductionKanbanFilteredEmptyState from './ProductionKanbanFilteredEmptyState';
import ProductionKanbanFilters from './ProductionKanbanFilters';

export default function ProductionKanban({
  discoveryLinks = [],
  videos,
  videoUserRecords,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenHome,
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
    setFilterMode,
    setSearchQuery,
  } = useProductionKanbanFilters({
    dataModel,
    draftRecords,
    videoUserRecords,
  });

  if (shouldShowProductionKanbanEmptyState({ discoveryLinkCandidates, productionSummary })) {
    return (
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenHome={onOpenHome}
        onOpenReferenceVault={onOpenReferenceVault}
      />
    );
  }

  const filteredContentProps = getProductionKanbanContentProps({
    discoveryLinkCandidates: filteredDataModel.discoveryLinkCandidates,
    draftRecords,
    focusVideos: filteredDataModel.focusVideos,
    groupedVideos: filteredDataModel.groupedVideos,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    onOpenDiscoveryLinks,
    onOpenReferenceVault,
    productionSummary: filteredDataModel.productionSummary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
    videoUserRecords,
  });

  return (
    <div className="space-y-4">
      <ProductionKanbanFilters
        filterMode={filterMode}
        filterSummary={filterSummary}
        onFilterModeChange={setFilterMode}
        onReset={resetFilters}
        onSearchQueryChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      {filterSummary.visibleCount === 0 ? (
        <ProductionKanbanFilteredEmptyState onReset={resetFilters} />
      ) : (
        <ProductionKanbanContent {...filteredContentProps} />
      )}
    </div>
  );
}
