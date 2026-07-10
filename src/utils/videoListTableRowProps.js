import { getYouTubeVideoUrl } from './urls';
import { hasStrongReaction, isTtoTtoCandidate } from './video';

const noop = () => {};

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

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
  const safeVideo = toVideoObject(video);
  const videoId = safeVideo.videoId;
  const hasVideoId = Boolean(videoId);
  const videoTitle = safeVideo.title || '제목 없는 영상';
  const isStrongReaction = hasStrongReaction(safeVideo);
  const isTtoTto = isTtoTtoCandidate(safeVideo);
  const videoUrl = getYouTubeVideoUrl(videoId);
  const canPromote = hasVideoId && typeof promoteVideoToProduction === 'function';
  const canToggleCheck = hasVideoId && typeof toggleCheckVideo === 'function';
  const canToggleScrap = hasVideoId && typeof toggleScrapVideo === 'function';

  return {
    candidateActionProps: {
      disabled: !canPromote,
      isProductionCandidate,
      onPromote: canPromote ? () => promoteVideoToProduction(safeVideo) : noop,
      videoTitle,
    },
    contentCellProps: {
      fetchTopComments,
      isChecked,
      isProductionCandidate,
      isSaved,
      isStrongReaction,
      isTtoTto,
      video: safeVideo,
      videoTitle,
      videoUrl,
    },
    markerCellsProps: {
      checkDisabled: !canToggleCheck,
      isChecked,
      isSaved,
      onToggleCheck: canToggleCheck ? () => toggleCheckVideo(videoId) : noop,
      onToggleScrap: canToggleScrap ? () => toggleScrapVideo(safeVideo) : noop,
      scrapDisabled: !canToggleScrap,
      videoTitle,
    },
    rowClassName: `group transition-all ${isChecked ? 'bg-indigo-50 ring-1 ring-indigo-200' : isStrongReaction || isTtoTto ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`,
    statsCellsProps: {
      isStrongReaction,
      video: safeVideo,
    },
  };
};
