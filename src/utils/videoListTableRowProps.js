import { getYouTubeVideoUrl } from './urls';
import { hasStrongReaction, isTtoTtoCandidate } from './video';

export const getVideoListTableRowViewProps = ({
  fetchTopComments,
  isChecked,
  isProductionCandidate,
  isSaved,
  promoteVideoToProduction,
  toggleCheckVideo,
  toggleScrapVideo,
  video,
}) => {
  const videoTitle = video.title || '제목 없는 영상';
  const isStrongReaction = hasStrongReaction(video);
  const isTtoTto = isTtoTtoCandidate(video);
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return {
    candidateActionProps: {
      isProductionCandidate,
      onPromote: () => promoteVideoToProduction(video),
      videoTitle,
    },
    contentCellProps: {
      fetchTopComments,
      isChecked,
      isProductionCandidate,
      isSaved,
      isStrongReaction,
      isTtoTto,
      video,
      videoTitle,
      videoUrl,
    },
    markerCellsProps: {
      isChecked,
      isSaved,
      onToggleCheck: () => toggleCheckVideo(video.videoId),
      onToggleScrap: () => toggleScrapVideo(video),
      videoTitle,
    },
    rowClassName: `group transition-all ${isChecked ? 'bg-indigo-50 ring-1 ring-indigo-200' : isStrongReaction || isTtoTto ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`,
    statsCellsProps: {
      isStrongReaction,
      video,
    },
  };
};
