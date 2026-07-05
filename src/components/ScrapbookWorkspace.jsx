import ProductionKanban from './ProductionKanban';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookHeader from './ScrapbookHeader';
import ScrapbookVideoCard from './ScrapbookVideoCard';
import { getCloudScrapbookVideos, getScrapbookWorkspaceViewProps } from '../utils/scrapbook';

export default function ScrapbookWorkspace({
  creatorView,
  discoveryLinks,
  copiedPrompt,
  promptCopyError,
  savedVideos,
  videoUserRecords,
  onCopyPrompt,
  onFetchComments,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
  onRemoveScrap,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
}) {
  const {
    getScrapbookVideoCardProps,
    headerProps,
    isProductionView,
    isScrapbookEmpty,
    productionKanbanProps,
  } = getScrapbookWorkspaceViewProps({
    creatorView,
    discoveryLinks,
    copiedPrompt,
    promptCopyError,
    savedVideos,
    videoUserRecords,
    onCopyPrompt,
    onFetchComments,
    onMoveVideo,
    onOpenDiscoveryLinks,
    onOpenReferenceVault,
    onRemoveScrap,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
  });
  const savedVideoList = getCloudScrapbookVideos(savedVideos);

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
      <ScrapbookHeader {...headerProps} />

      {isProductionView ? (
        <ProductionKanban {...productionKanbanProps} />
      ) : isScrapbookEmpty ? (
        <ScrapbookEmptyState />
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
