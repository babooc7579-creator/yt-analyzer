import ProductionKanban from './ProductionKanban';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookHeader from './ScrapbookHeader';
import ScrapbookVideoCard from './ScrapbookVideoCard';
import { getCloudScrapbookVideos, getScrapbookWorkspaceViewProps } from '../utils/scrapbook';

export default function ScrapbookWorkspace({
  creatorView,
  discoveryLinks,
  copiedPrompt,
  creatorViewIntent,
  promptCopyError,
  savedVideos,
  videoUserRecords,
  onCopyPrompt,
  onFetchComments,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenHome,
  onOpenProductionCandidates,
  onOpenReferenceVault,
  onOpenUploadCalendar,
  onRemoveScrap,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
  onUnsavedDraftsChange,
}) {
  const {
    getScrapbookVideoCardProps,
    headerProps,
    isProductionView,
    isScrapbookEmpty,
    productionKanbanProps,
    scrapbookEmptyStateProps,
  } = getScrapbookWorkspaceViewProps({
    creatorView,
    discoveryLinks,
    copiedPrompt,
    creatorViewIntent,
    promptCopyError,
    savedVideos,
    videoUserRecords,
    onCopyPrompt,
    onFetchComments,
    onMoveVideo,
    onOpenDiscoveryLinks,
    onOpenHome,
    onOpenProductionCandidates,
    onOpenReferenceVault,
    onOpenUploadCalendar,
    onRemoveScrap,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    onUnsavedDraftsChange,
  });
  const savedVideoList = getCloudScrapbookVideos(savedVideos);

  return (
    <div className="min-h-[600px] flex-1 animate-in overflow-y-auto rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm fade-in duration-300 sm:p-6">
      <ScrapbookHeader {...headerProps} />

      {isProductionView ? (
        <ProductionKanban {...productionKanbanProps} />
      ) : isScrapbookEmpty ? (
        <ScrapbookEmptyState {...scrapbookEmptyStateProps} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedVideoList.map((video) => (
            <ScrapbookVideoCard key={video.videoId} {...getScrapbookVideoCardProps(video)} />
          ))}
        </div>
      )}
    </div>
  );
}
