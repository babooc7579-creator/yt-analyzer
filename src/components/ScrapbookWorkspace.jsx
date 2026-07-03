import ProductionKanban from './ProductionKanban';
import ScrapbookEmptyState from './ScrapbookEmptyState';
import ScrapbookHeader from './ScrapbookHeader';
import ScrapbookVideoCard from './ScrapbookVideoCard';
import { formatNumberedUrlList, getYouTubeVideoUrl } from '../utils/urls';

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
  const videoUrlList = formatNumberedUrlList(
    savedVideos
      .filter((video) => video.videoId)
      .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
  );

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
      <ScrapbookHeader
        savedVideoCount={savedVideos.length}
        copiedPrompt={copiedPrompt}
        promptCopyError={promptCopyError}
        onCopyPrompt={onCopyPrompt}
        videoUrlList={videoUrlList}
        variant={creatorView === 'studio-candidates' ? 'production' : 'scrapbook'}
      />

      {creatorView === 'studio-candidates' ? (
        <ProductionKanban
          discoveryLinks={discoveryLinks}
          videos={savedVideos}
          videoUserRecords={videoUserRecords}
          onMoveVideo={onMoveVideo}
          onOpenDiscoveryLinks={onOpenDiscoveryLinks}
          onUpdateDiscoveryLink={onUpdateDiscoveryLink}
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
