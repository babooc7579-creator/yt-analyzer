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

  const headerProps = {
    savedVideoCount: savedVideos.length,
    copiedPrompt,
    promptCopyError,
    onCopyPrompt,
    videoUrlList,
    variant: creatorView === 'studio-candidates' ? 'production' : 'scrapbook',
  };

  const productionKanbanProps = {
    discoveryLinks,
    videos: savedVideos,
    videoUserRecords,
    onMoveVideo,
    onOpenDiscoveryLinks,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    onOpenReferenceVault,
  };

  const getScrapbookVideoCardProps = (video) => ({
    video,
    onFetchComments,
    onRemoveScrap,
  });

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
      <ScrapbookHeader {...headerProps} />

      {creatorView === 'studio-candidates' ? (
        <ProductionKanban {...productionKanbanProps} />
      ) : savedVideos.length === 0 ? (
        <ScrapbookEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedVideos.map((video) => (
            <ScrapbookVideoCard key={video.videoId} {...getScrapbookVideoCardProps(video)} />
          ))}
        </div>
      )}
    </div>
  );
}
