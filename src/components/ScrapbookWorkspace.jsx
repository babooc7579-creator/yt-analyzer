import ProductionKanban from './ProductionKanban';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookHeader from './ScrapbookHeader';
import ScrapbookVideoCard from './ScrapbookVideoCard';

export default function ScrapbookWorkspace({
  creatorView,
  discoveryLinks,
  savedVideos,
  videoUserRecords,
  onCopyPrompt,
  onFetchComments,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
  onRemoveScrap,
  onUpdateVideoRecord,
}) {
  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
      <ScrapbookHeader
        savedVideoCount={savedVideos.length}
        onCopyPrompt={onCopyPrompt}
      />

      {creatorView === 'studio-candidates' ? (
        <ProductionKanban
          discoveryLinks={discoveryLinks}
          videos={savedVideos}
          videoUserRecords={videoUserRecords}
          onMoveVideo={onMoveVideo}
          onOpenDiscoveryLinks={onOpenDiscoveryLinks}
          onUpdateVideoRecord={onUpdateVideoRecord}
          onOpenReferenceVault={onOpenReferenceVault}
        />
      ) : savedVideos.length === 0 ? (
        <ScrapbookEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedVideos.map((video) => (
            <ScrapbookVideoCard
              key={video.videoId}
              video={video}
              onFetchComments={onFetchComments}
              onRemoveScrap={onRemoveScrap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
